'use client';

import Link from 'next/link';
import { Twitter, Linkedin, Github } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    product: [
      { name: 'Features', href: '#features' },
      { name: 'Pricing', href: '#pricing' },
      { name: 'Security', href: '#' },
    ],
    company: [
      { name: 'About', href: '#about' },
      { name: 'Blog', href: '#' },
      { name: 'Careers', href: '#' },
    ],
    legal: [
      { name: 'Privacy', href: '#' },
      { name: 'Terms', href: '#' },
      { name: 'Cookies', href: '#' },
    ],
  };

  const socialLinks = [
    { name: 'Twitter', icon: Twitter, href: '#' },
    { name: 'LinkedIn', icon: Linkedin, href: '#' },
    { name: 'GitHub', icon: Github, href: '#' },
  ];

  return (
    <footer className="bg-muted/50 border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <motion.div 
          className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5 }}
        >
          {/* Brand Column */}
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="flex items-center space-x-2 mb-4 group">
              <motion.div 
                className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center"
                whileHover={{ rotate: 10, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <span className="text-primary-foreground font-bold text-lg">B</span>
              </motion.div>
              <span className="text-xl font-bold text-foreground">Bizkopa</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-xs mb-6">
              The modern business management platform that helps you create, manage, and grow your business with ease.
            </p>
            {/* Social Links */}
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <motion.a
                  key={social.name}
                  href={social.href}
                  className="text-muted-foreground hover:text-foreground transition-colors"
                  aria-label={social.name}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -3, scale: 1.1 }}
                >
                  <social.icon className="h-5 w-5" />
                </motion.a>
              ))}
            </div>
          </div>

          {/* Product Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Product</h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link, index) => (
                <motion.li 
                  key={link.name}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <motion.a
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                    whileHover={{ x: 3 }}
                  >
                    {link.name}
                  </motion.a>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Company Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Company</h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link, index) => (
                <motion.li 
                  key={link.name}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <motion.a
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                    whileHover={{ x: 3 }}
                  >
                    {link.name}
                  </motion.a>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Legal Links */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Legal</h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link, index) => (
                <motion.li 
                  key={link.name}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.05 }}
                >
                  <motion.a
                    href={link.href}
                    className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                    whileHover={{ x: 3 }}
                  >
                    {link.name}
                  </motion.a>
                </motion.li>
              ))}
            </ul>
          </div>
        </motion.div>

        {/* Bottom Bar */}
        <motion.div 
          className="border-t border-border mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <p className="text-muted-foreground text-sm">
            © {currentYear} Bizkopa. All rights reserved.
          </p>
          <p className="text-muted-foreground text-sm">
            Made with care for businesses Nigeria.
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
