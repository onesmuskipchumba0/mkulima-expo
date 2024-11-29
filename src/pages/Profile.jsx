import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { supabase } from '../config/supabase'
import { useNavigate } from 'react-router-dom'

export default function Profile() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [message, setMessage] = useState({ type: '', content: '' })
  const [profile, setProfile] = useState({
    full_name: '',
    phone_number: '',
    location: '',
    user_type: '',
    // Farmer specific fields
    farm_name: '',
    farm_size: '',
    main_products: '',
    // Buyer specific fields
    company_name: '',
    business_type: '',
    preferred_products: ''
  })

  useEffect(() => {
    if (!user) {
      navigate('/signin')
      return
    }
    getProfile()
  }, [user, navigate])

  async function getProfile() {
    try {
      setLoading(true)
      
      // First, try to get the existing profile
      let { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)

      if (error) throw error

      // If no profile exists, create one with user_type from auth metadata
      if (!data || data.length === 0) {
        const { data: userData } = await supabase.auth.getUser()
        const userType = userData.user.user_metadata?.user_type || 'buyer'
        
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert([
            { 
              id: user.id,
              user_type: userType
            }
          ])
          .select()
          .single()

        if (insertError) throw insertError
        data = newProfile
      } else {
        // If we found existing data, use the first record
        data = data[0]
      }

      setProfile({
        ...profile,
        ...data
      })
    } catch (error) {
      console.error('Error:', error)
      setMessage({ type: 'error', content: error.message })
    } finally {
      setLoading(false)
    }
  }

  async function updateProfile(e) {
    e.preventDefault()

    try {
      setLoading(true)
      const { error } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...profile,
          updated_at: new Date().toISOString()
        })

      if (error) throw error
      setMessage({ type: 'success', content: 'Profile updated successfully!' })
    } catch (error) {
      console.error('Error:', error)
      setMessage({ type: 'error', content: error.message })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-base-200 py-8">
      <div className="max-w-2xl mx-auto p-4">
        <div className="bg-base-100 shadow-xl rounded-lg p-6">
          <h2 className="text-3xl font-bold mb-6">Profile Settings</h2>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="loading loading-spinner loading-lg text-primary"></div>
              <p className="mt-4 text-base-content/70">Loading your profile...</p>
            </div>
          ) : (
            <>
              {message.content && (
                <div className={`alert ${message.type === 'error' ? 'alert-error' : 'alert-success'} mb-4`}>
                  <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                    {message.type === 'error' ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    )}
                  </svg>
                  <span>{message.content}</span>
                </div>
              )}

              <form onSubmit={updateProfile} className="space-y-4">
                {/* Basic Information */}
                <div className="divider">Basic Information</div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Full Name</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered"
                      value={profile.full_name || ''}
                      onChange={(e) => setProfile({ ...profile, full_name: e.target.value })}
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Phone Number</span>
                    </label>
                    <input
                      type="tel"
                      className="input input-bordered"
                      value={profile.phone_number || ''}
                      onChange={(e) => setProfile({ ...profile, phone_number: e.target.value })}
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Location</span>
                    </label>
                    <input
                      type="text"
                      className="input input-bordered"
                      value={profile.location || ''}
                      onChange={(e) => setProfile({ ...profile, location: e.target.value })}
                    />
                  </div>

                  <div className="form-control">
                    <label className="label">
                      <span className="label-text">Email</span>
                    </label>
                    <input
                      type="email"
                      className="input input-bordered"
                      value={user?.email || ''}
                      disabled
                    />
                  </div>
                </div>

                {/* Farmer Specific Fields */}
                {profile.user_type === 'farmer' && (
                  <>
                    <div className="divider">Farmer Information</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Farm Name</span>
                        </label>
                        <input
                          type="text"
                          className="input input-bordered"
                          value={profile.farm_name || ''}
                          onChange={(e) => setProfile({ ...profile, farm_name: e.target.value })}
                        />
                      </div>

                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Farm Size (acres)</span>
                        </label>
                        <input
                          type="number"
                          className="input input-bordered"
                          value={profile.farm_size || ''}
                          onChange={(e) => setProfile({ ...profile, farm_size: e.target.value })}
                        />
                      </div>

                      <div className="form-control md:col-span-2">
                        <label className="label">
                          <span className="label-text">Main Products</span>
                        </label>
                        <textarea
                          className="textarea textarea-bordered h-24"
                          placeholder="List your main agricultural products"
                          value={profile.main_products || ''}
                          onChange={(e) => setProfile({ ...profile, main_products: e.target.value })}
                        ></textarea>
                      </div>
                    </div>
                  </>
                )}

                {/* Buyer Specific Fields */}
                {profile.user_type === 'buyer' && (
                  <>
                    <div className="divider">Buyer Information</div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Company Name</span>
                        </label>
                        <input
                          type="text"
                          className="input input-bordered"
                          value={profile.company_name || ''}
                          onChange={(e) => setProfile({ ...profile, company_name: e.target.value })}
                        />
                      </div>

                      <div className="form-control">
                        <label className="label">
                          <span className="label-text">Business Type</span>
                        </label>
                        <select
                          className="select select-bordered"
                          value={profile.business_type || ''}
                          onChange={(e) => setProfile({ ...profile, business_type: e.target.value })}
                        >
                          <option value="">Select business type</option>
                          <option value="retailer">Retailer</option>
                          <option value="wholesaler">Wholesaler</option>
                          <option value="processor">Processor</option>
                          <option value="exporter">Exporter</option>
                          <option value="other">Other</option>
                        </select>
                      </div>

                      <div className="form-control md:col-span-2">
                        <label className="label">
                          <span className="label-text">Preferred Products</span>
                        </label>
                        <textarea
                          className="textarea textarea-bordered h-24"
                          placeholder="List the types of products you're interested in"
                          value={profile.preferred_products || ''}
                          onChange={(e) => setProfile({ ...profile, preferred_products: e.target.value })}
                        ></textarea>
                      </div>
                    </div>
                  </>
                )}

                <div className="mt-6">
                  <button
                    type="submit"
                    className={`btn btn-primary w-full ${loading ? 'loading' : ''}`}
                    disabled={loading}
                  >
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
