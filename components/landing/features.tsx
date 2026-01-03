'use client';

import { Building2, Users, Shield, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: Building2,
    title: 'Business Management',
    description:
      'Create and manage multiple businesses from a single dashboard. Keep everything organized and accessible.',
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description:
      'Invite staff members to your business and collaborate effectively. Manage your team with ease.',
  },
  {
    icon: Shield,
    title: 'Role-Based Access',
    description:
      'Control who can do what with flexible role permissions. Keep your data secure and organized.',
  },
  {
    icon: Zap,
    title: 'Simple & Fast',
    description:
      'Get started in minutes, not hours. Our intuitive interface makes business management effortless.',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
};

const FeaturesSection = () => {
  return (
    <section id="features" className="py-20 lg:py-32 bg-background">
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
            Everything you need to
            <span className="text-gradient"> grow your business</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Bizkopa provides all the essential tools to manage your business, team, and operations
            in one unified platform.
          </p>
        </motion.div>

        {/* Features Grid */}
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {features.map((feature) => (
            <motion.div
              key={feature.title}
              className="group relative p-6 lg:p-8 rounded-2xl border border-border bg-card transition-colors duration-300"
              variants={itemVariants}
              whileHover={{ 
                y: -8,
                boxShadow: "0 20px 40px -20px hsl(var(--primary) / 0.15)"
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              {/* Icon */}
              <motion.div 
                className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-5 transition-colors duration-300 group-hover:bg-primary/20"
                whileHover={{ rotate: [0, -10, 10, 0], scale: 1.1 }}
                transition={{ duration: 0.4 }}
              >
                <feature.icon className="h-6 w-6 text-primary" />
              </motion.div>

              {/* Content */}
              <h3 className="text-lg font-semibold text-foreground mb-3">
                {feature.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>

              {/* Hover decoration */}
              <motion.div 
                className="absolute inset-0 rounded-2xl bg-linear-to-br from-primary/5 to-transparent pointer-events-none"
                initial={{ opacity: 0 }}
                whileHover={{ opacity: 1 }}
              />
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeaturesSection;
