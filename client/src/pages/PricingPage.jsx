import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Check, Sparkles, Crown, Building2, GraduationCap } from 'lucide-react';
import { Card, Button, Badge } from '../components/ui';

const plans = [
  {
    name: 'Free', price: 0, period: 'forever', icon: Sparkles,
    features: ['5 AI generations/day', 'Basic templates', 'Community access', 'Publish poetry'],
    cta: 'Current Plan', variant: 'secondary',
  },
  {
    name: 'Student', price: 99, period: '/month', icon: GraduationCap,
    features: ['50 AI generations/day', 'All templates', 'AI review', 'No ads', 'Priority support'],
    cta: 'Get Student', variant: 'secondary', popular: false,
  },
  {
    name: 'Creator', price: 299, period: '/month', icon: Crown, popular: true,
    features: ['Unlimited AI generations', 'Advanced controls', 'AI review & analytics', 'Custom branding', 'Marketplace seller', 'Premium badge'],
    cta: 'Go Creator', variant: 'primary',
  },
  {
    name: 'Enterprise', price: 999, period: '/month', icon: Building2,
    features: ['Everything in Creator', 'Team management', 'API access', 'Custom AI models', 'Dedicated support', 'White-label option'],
    cta: 'Contact Sales', variant: 'secondary',
  },
];

export default function PricingPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-16">
        <Badge variant="gold">Premium Plans</Badge>
        <h1 className="text-4xl font-bold mt-4">Unlock Your Creative Potential</h1>
        <p className="mt-4 max-w-lg mx-auto" style={{ color: 'var(--text-muted)' }}>
          Choose the plan that fits your literary journey. All plans include dark/light theme and community access.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((plan, i) => (
          <motion.div key={plan.name} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
            <Card className={`h-full flex flex-col relative ${plan.popular ? 'ring-2 ring-[var(--color-primary)]' : ''}`}>
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <Badge variant="gold">Most Popular</Badge>
                </div>
              )}
              <div className="text-center mb-6">
                <plan.icon size={32} className="mx-auto mb-3 text-[var(--color-primary)]" />
                <h3 className="text-xl font-bold">{plan.name}</h3>
                <div className="mt-3">
                  <span className="text-3xl font-bold">{plan.price === 0 ? 'Free' : `₹${plan.price}`}</span>
                  {plan.price > 0 && <span className="text-sm" style={{ color: 'var(--text-muted)' }}>{plan.period}</span>}
                </div>
              </div>
              <ul className="space-y-3 flex-1 mb-6">
                {plan.features.map((f) => (
                  <li key={f} className="flex items-start gap-2 text-sm">
                    <Check size={16} className="text-green-500 mt-0.5 shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
              <Button variant={plan.variant} className="w-full">{plan.cta}</Button>
            </Card>
          </motion.div>
        ))}
      </div>

      <p className="text-center text-sm mt-8" style={{ color: 'var(--text-muted)' }}>
        All paid plans support Razorpay and Stripe. Cancel anytime. Yearly plans save 20%.
      </p>
    </div>
  );
}
