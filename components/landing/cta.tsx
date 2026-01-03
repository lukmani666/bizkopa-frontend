'use client'

import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';

const CTASection = () => {
  return (
    <section id="about" className="py-20 lg:py-32 bg-background relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
          animate={{ 
            x: [0, 30, 0],
            y: [0, -20, 0],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl"
          animate={{ 
            x: [0, -30, 0],
            y: [0, 20, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.7 }}
        >
          <motion.div 
            className="bg-linear-to-br from-primary/10 via-primary/5 to-transparent rounded-3xl border border-primary/20 p-8 lg:p-16 text-center"
            whileHover={{ 
              borderColor: 'hsl(var(--primary) / 0.4)',
              boxShadow: '0 0 60px -20px hsl(var(--primary) / 0.3)'
            }}
            transition={{ duration: 0.3 }}
          >
            {/* Headline */}
            <motion.h2 
              className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              Ready to streamline
              <span className="block text-gradient">your business?</span>
            </motion.h2>

            {/* Description */}
            <motion.p 
              className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              Join thousands of businesses already using Bizkopa to manage their teams and grow
              their operations. Start your journey today — it is completely free.
            </motion.p>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4, duration: 0.5 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button size="lg" asChild className="h-14 px-10 text-base font-semibold">
                <Link href="/auth/signup">
                  Get Started for Free
                  <motion.span
                    className="ml-2 inline-flex"
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 2 }}
                  >
                    <ArrowRight className="h-5 w-5" />
                  </motion.span>
                </Link>
              </Button>
            </motion.div>

            {/* Trust text */}
            <motion.p 
              className="mt-6 text-sm text-muted-foreground"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              No credit card required • Free forever plan available
            </motion.p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default CTASection;
