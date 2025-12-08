import { useState, useEffect } from 'react';
import { getProfile, createProfile, updateProfile } from '../services/profile.service';

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    imageUrl: '',
    phoneNumber: '',
    bio: '',
    address: '',
    skill: '', 
  });
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await getProfile();
      if (data && data.data) {
        setProfile(data.data);
        setFormData({
            name: data.data.name || '',
            imageUrl: data.data.imageUrl || '',
            phoneNumber: data.data.phoneNumber || '',
            bio: data.data.bio || '',
            address: data.data.address || '',
            skill: data.data.skill ? data.data.skill.join(', ') : '',
        });
      }
    } catch (err) {
      console.log('No profile found or error fetching profile', err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      skill: formData.skill.split(',').map((s) => s.trim()).filter(Boolean),
    };

    try {
      if (profile) {
        await updateProfile(payload);
        setMessage('Profile updated successfully');
      } else {
        await createProfile(payload);
        setMessage('Profile created successfully');
      }
      setIsEditing(false);
      loadProfile();
    } catch (err) {
        if(err.response?.data?.message === "Profile already exists"){
            try {
                 await updateProfile(payload);
                setMessage('Profile updated successfully');
                setIsEditing(false);
                loadProfile();
            } catch (updateErr) {
                 setMessage('Failed to save profile');
            }
        }
        else {
             setMessage('Failed to save profile');
        }

    }
  };

  if (!profile && !isEditing) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-foreground">No Profile Found</h2>
          <button
            onClick={() => setIsEditing(true)}
            className="mt-4 rounded-md bg-primary px-4 py-2 text-primary-foreground"
          >
            Create Profile
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-2xl overflow-hidden rounded-lg border border-border bg-card shadow">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">My Profile</h2>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            >
              {isEditing ? 'Cancel' : 'Edit'}
            </button>
          </div>

          {message && <div className="mt-4 text-green-500">{message}</div>}

          {isEditing ? (
            <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-foreground">Name</label>
                <input
                  name="name"
                  type="text"
                  required
                  className="mt-1 block w-full rounded-md border border-input bg-background p-2 text-foreground"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground">Image URL</label>
                <input
                  name="imageUrl"
                  type="text"
                  className="mt-1 block w-full rounded-md border border-input bg-background p-2 text-foreground"
                  value={formData.imageUrl}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground">Phone Number</label>
                <input
                  name="phoneNumber"
                  type="text"
                  className="mt-1 block w-full rounded-md border border-input bg-background p-2 text-foreground"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground">Skills (comma separated)</label>
                <input
                  name="skill"
                  type="text"
                  className="mt-1 block w-full rounded-md border border-input bg-background p-2 text-foreground"
                  value={formData.skill}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground">Bio</label>
                <textarea
                  name="bio"
                  rows={3}
                  className="mt-1 block w-full rounded-md border border-input bg-background p-2 text-foreground"
                  value={formData.bio}
                  onChange={handleChange}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-foreground">Address</label>
                <textarea
                  name="address"
                  rows={2}
                  className="mt-1 block w-full rounded-md border border-input bg-background p-2 text-foreground"
                  value={formData.address}
                  onChange={handleChange}
                />
              </div>
              <button
                type="submit"
                className="w-full rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
              >
                Save Changes
              </button>
            </form>
          ) : (
            <div className="mt-6 space-y-6">
              <div className="flex items-center space-x-4">
                {profile.imageUrl && (
                  <img
                    src={profile.imageUrl}
                    alt={profile.name}
                    className="h-16 w-16 rounded-full object-cover"
                  />
                )}
                <div>
                    <h3 className="text-lg font-medium text-foreground">{profile.name}</h3>
                    <p className="text-sm text-muted-foreground">{profile.auth?.email}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                     <h4 className="text-sm font-medium text-muted-foreground">Phone</h4>
                     <p className="text-foreground">{profile.phoneNumber || 'N/A'}</p>
                </div>
                 <div>
                     <h4 className="text-sm font-medium text-muted-foreground">Role</h4>
                     <p className="text-foreground">{profile.auth?.role || 'N/A'}</p>
                </div>
                 <div className="col-span-1 sm:col-span-2">
                     <h4 className="text-sm font-medium text-muted-foreground">About</h4>
                     <p className="text-foreground">{profile.bio || 'N/A'}</p>
                </div>
                 <div className="col-span-1 sm:col-span-2">
                     <h4 className="text-sm font-medium text-muted-foreground">Address</h4>
                     <p className="text-foreground">{profile.address || 'N/A'}</p>
                </div>
                 <div className="col-span-1 sm:col-span-2">
                     <h4 className="text-sm font-medium text-muted-foreground">Skills</h4>
                     <div className="mt-1 flex flex-wrap gap-2">
                         {profile.skill?.map((s, i) => (
                             <span key={i} className="inline-flex items-center rounded-full border border-border px-2.5 py-0.5 text-xs font-semibold text-foreground">
                                 {s}
                             </span>
                         ))}
                     </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
