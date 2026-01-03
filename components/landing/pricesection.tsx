'use client'; 

import { Check, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Link  from 'next/link';
import { motion } from 'framer-motion';

const plans = [
  {
    name: 'Free',
    description: 'Perfect for getting started',
    price: '$0',
    period: 'forever',
    badge: 'Current Plan',
    highlighted: true,
    features: [
      '1 business',
      'Up to 5 team members',
      'Basic role management',
      'Email support',
      'Core features included',
    ],
    cta: 'Get Started',
    ctaLink: '/auth/signup',
    disabled: false,
  },
  {
    name: 'Premium',
    description: 'For growing businesses',
    price: '$29',
    period: '/month',
    badge: 'Coming Soon',
    highlighted: false,
    features: [
      'Unlimited businesses',
      'Unlimited team members',
      'Advanced role permissions',
      'Priority support',
      'Analytics & insights',
      'API access',
      'Custom branding',
    ],
    cta: 'Notify Me',
    ctaLink: '#',
    disabled: true,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const,
    },
  },
};

const featureVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.3,
    },
  }),
};

const PricingSection = () => {
  return (
    <section id="pricing" className="py-20 lg:py-32 bg-muted/30">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div 
          className="max-w-3xl mx-auto text-center mb-16 lg:mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-6">
            Simple, transparent
            <span className="text-gradient"> pricing</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Start for free and upgrade when you need more. No hidden fees, no surprises.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <motion.div 
          className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {plans.map((plan, planIndex) => (
            <motion.div
              key={plan.name}
              className={`relative rounded-2xl p-8 ${
                plan.highlighted
                  ? 'bg-card border-2 border-primary shadow-xl shadow-primary/10'
                  : 'bg-card border border-border'
              }`}
              variants={cardVariants}
              whileHover={{ 
                y: -8,
                transition: { type: "spring", stiffness: 300, damping: 20 }
              }}
            >
              {/* Badge */}
              <motion.div 
                className="absolute -top-3 left-8"
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + planIndex * 0.1, duration: 0.4 }}
              >
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                    plan.highlighted
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  }`}
                >
                  {plan.highlighted && (
                    <motion.span
                      animate={{ rotate: [0, 15, -15, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    >
                      <Sparkles className="h-3 w-3" />
                    </motion.span>
                  )}
                  {plan.badge}
                </span>
              </motion.div>

              {/* Plan Header */}
              <div className="mb-8 pt-4">
                <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
                <p className="text-muted-foreground text-sm">{plan.description}</p>
              </div>

              {/* Price */}
              <div className="mb-8">
                <motion.span 
                  className="text-5xl font-bold text-foreground"
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                >
                  {plan.price}
                </motion.span>
                <span className="text-muted-foreground ml-1">{plan.period}</span>
              </div>

              {/* Features */}
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, i) => (
                  <motion.li 
                    key={feature} 
                    className="flex items-start gap-3"
                    custom={i}
                    variants={featureVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                  >
                    <motion.div 
                      className="shrink-0 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center mt-0.5"
                      whileHover={{ scale: 1.2, backgroundColor: 'hsl(var(--primary) / 0.3)' }}
                    >
                      <Check className="h-3 w-3 text-primary" />
                    </motion.div>
                    <span className="text-foreground text-sm">{feature}</span>
                  </motion.li>
                ))}
              </ul>

              {/* CTA Button */}
              <motion.div
                whileHover={{ scale: plan.disabled ? 1 : 1.02 }}
                whileTap={{ scale: plan.disabled ? 1 : 0.98 }}
              >
                <Button
                  className="w-full h-12"
                  variant={plan.highlighted ? 'default' : 'outline'}
                  disabled={plan.disabled}
                  asChild={!plan.disabled}
                >
                  {plan.disabled ? (
                    <span>{plan.cta}</span>
                  ) : (
                    <Link href={plan.ctaLink}>{plan.cta}</Link>
                  )}
                </Button>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        {/* FAQ Teaser */}
        <motion.div 
          className="max-w-2xl mx-auto text-center mt-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-muted-foreground">
            Have questions?{' '}
            <motion.a 
              href="#" 
              className="text-primary font-medium"
              whileHover={{ textDecoration: 'underline' }}
            >
              Contact us
            </motion.a>{' '}
            — we are here to help.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;
