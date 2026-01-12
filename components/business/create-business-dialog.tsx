'use client';

import React, { useState } from "react";
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from 'zod';
import { Plus } from "lucide-react";
import { Button } from "../ui/button";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { 
  Form,
  FormControl,
  FormItem, 
  FormField,
  FormLabel,
  FormMessage
} from "../ui/form";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { useBusinessStore } from "@/stores/business.store";
import { toast } from 'sonner';

const createBusinessSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name must be less than 100 characters'),
  industry: z
    .string()
    .trim()
    .min(2, 'Industry must be at least 2 characters'),
  phoneNumber: z
    .string()
    .trim()
    .min(7, 'Phone number is required'),
  email: z
    .string()
    .trim()
    .email('Valid business email required')
    .or(z.literal(''))
    .optional(),
  address: z
    .string()
    .trim()
    .min(2, 'Address is required')
    .max(200, 'Address must be less than 200 characters')
});

type CreateBusinessForm = z.infer<typeof createBusinessSchema>;

interface CreateBusinessDialogProps {
  trigger?: React.ReactNode;
}

export function CreateBusinessDialog({ trigger }: CreateBusinessDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const createBusiness = useBusinessStore((state) => state.createBusiness);

  const form = useForm<CreateBusinessForm>({
    resolver: zodResolver(createBusinessSchema),
    defaultValues: {
      name: '',
      industry: '',
      phoneNumber: '',
      email: '',
      address: '',
    },
  });

  const onSubmit = async (values: CreateBusinessForm) => {
    setIsLoading(true);

    try {
      await createBusiness({
        name: values.name,
        industry: values.industry,
        phoneNumber: values.phoneNumber,
        email: values.email || undefined,
        address: values.address,
      });

      toast.success('Business create successfully');
      form.reset();
      setOpen(false);
    } catch (error: any) {
      toast.error(error.message || 'Failed to create business');
    } finally {
      setIsLoading(false);
    }
  };

   return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Create Business
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="sm:max-w-106.25">
        <DialogHeader>
          <DialogTitle>Create a new business</DialogTitle>
          <DialogDescription>
            Add a business to manage your operations on Bizkopa.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Acme Inc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="industry"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Industry</FormLabel>
                  <FormControl>
                    <Input placeholder="Retail, Tech, etc." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="+1 555 123 4567" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Business Email (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="contact@acme.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Business address..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isLoading}
              >
                Cancel
              </Button>

              <Button type="submit" disabled={isLoading} className='cursor-pointer'>
                {isLoading ? 'Creating...' : 'Create Business'}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}