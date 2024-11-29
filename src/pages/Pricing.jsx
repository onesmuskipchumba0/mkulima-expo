import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../config/supabase';
import { useNavigate } from 'react-router-dom';
import { MdVerified, MdAnalytics, MdPhotoLibrary } from 'react-icons/md';
import { BiMessageDetail } from 'react-icons/bi';
import { FaCheck } from 'react-icons/fa';

function Pricing() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [currentPlan, setCurrentPlan] = useState('Basic');
  const [loading, setLoading] = useState(false);
  const [loadingPlan, setLoadingPlan] = useState(true);

  useEffect(() => {
    if (user) {
      fetchCurrentPlan();
    } else {
      setLoadingPlan(false);
    }
  }, [user]);

  const fetchCurrentPlan = async () => {
    try {
      const { data: subscription } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single();

      if (subscription) {
        setCurrentPlan(subscription.plan);
      }
    } catch (error) {
      console.error('Error fetching subscription:', error);
    } finally {
      setLoadingPlan(false);
    }
  };

  const plans = [
    {
      name: 'Basic',
      price: '0',
      features: [
        'Basic product listings',
        'Contact via phone',
        'Basic product details',
        'Standard support'
      ],
      buttonText: currentPlan === 'Basic' ? 'Current Plan' : 'Choose Basic',
      recommended: false
    },
    {
      name: 'Premium',
      price: '999',
      features: [
        'Verified seller badge',
        'Product analytics',
        'Multiple product images',
        'Featured listings',
        'Priority support'
      ],
      buttonText: currentPlan === 'Premium' ? 'Current Plan' : 'Upgrade Now',
      recommended: true
    },
    {
      name: 'Business',
      price: '2499',
      features: [
        'All Premium features',
        'In-app messaging',
        'Market insights',
        'Bulk listings',
        'API access',
        'Dedicated support'
      ],
      buttonText: currentPlan === 'Business' ? 'Current Plan' : 'Get Business',
      recommended: false
    }
  ];

  const handleSubscribe = async (planName) => {
    if (!user) {
      navigate('/login', { state: { from: '/pricing' } });
      return;
    }

    if (currentPlan === planName) {
      return; // Don't do anything if it's the current plan
    }

    setLoading(true);
    try {
      // First check if user already has a subscription
      const { data: existingSub, error: subError } = await supabase
        .from('subscriptions')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (subError && subError.code !== 'PGRST116') {
        throw subError;
      }

      if (existingSub) {
        // Update existing subscription
        const { error: updateError } = await supabase
          .from('subscriptions')
          .update({
            plan: planName,
            status: 'active',
            updated_at: new Date().toISOString()
          })
          .eq('user_id', user.id);

        if (updateError) throw updateError;
      } else {
        // Create new subscription
        const { error: insertError } = await supabase
          .from('subscriptions')
          .insert([
            {
              user_id: user.id,
              plan: planName,
              status: 'active',
              started_at: new Date().toISOString()
            }
          ]);

        if (insertError) throw insertError;
      }

      // Update user's premium status
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          is_premium: planName !== 'Basic',
          premium_features: planName === 'Basic' ? null : {
            verified: true,
            analytics: true,
            featured: true,
            ...(planName === 'Business' && {
              messaging: true,
              market_insights: true,
              bulk_listings: true,
              api_access: true
            })
          }
        })
        .eq('id', user.id);

      if (profileError) throw profileError;

      setCurrentPlan(planName);
      // TODO: Implement actual payment gateway integration
      alert(`Successfully ${planName === 'Basic' ? 'downgraded to' : 'upgraded to'} ${planName} plan! (Payment gateway to be implemented)`);
    } catch (error) {
      console.error('Error updating subscription:', error);
      alert(`Failed to update subscription: ${error.message || 'Please try again.'}`);
    } finally {
      setLoading(false);
    }
  };

  if (loadingPlan) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-100 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Choose Your Plan</h1>
          <p className="text-lg opacity-80">
            Select the perfect plan for your farming business
          </p>
          {!user && (
            <p className="text-sm text-primary mt-4">
              Please log in to upgrade your plan
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`card bg-base-100 shadow-xl ${
                plan.recommended ? 'border-2 border-primary' : 'border border-base-300'
              } ${currentPlan === plan.name ? 'ring-2 ring-primary' : ''}`}
            >
              {plan.recommended && (
                <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                  <span className="badge badge-primary">Recommended</span>
                </div>
              )}
              {currentPlan === plan.name && (
                <div className="absolute -top-4 right-4">
                  <span className="badge badge-success">Current Plan</span>
                </div>
              )}
              <div className="card-body">
                <h2 className="card-title justify-center mb-2">{plan.name}</h2>
                <div className="text-center mb-6">
                  <span className="text-3xl font-bold">
                    KSH {plan.price}
                  </span>
                  {plan.price !== '0' && <span className="text-sm opacity-80">/month</span>}
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <FaCheck className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>
                <div className="card-actions justify-center mt-auto">
                  <button
                    className={`btn btn-block ${
                      currentPlan === plan.name
                        ? 'btn-disabled'
                        : plan.recommended
                        ? 'btn-primary'
                        : 'btn-outline'
                    }`}
                    onClick={() => handleSubscribe(plan.name)}
                    disabled={loading || currentPlan === plan.name}
                  >
                    {loading ? (
                      <span className="loading loading-spinner loading-sm"></span>
                    ) : (
                      plan.buttonText
                    )}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Pricing;
