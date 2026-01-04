import { useState, useEffect } from 'react';
import StarRating from '../components/StarRating';
import { getProfile, createProfile, updateProfile } from '../services/profile.service';

const PROFICIENCY_LEVELS = ['beginner', 'intermediate', 'advanced', 'expert'];
const CATEGORIES = ['Programming', 'Design', 'Marketing', 'Writing', 'Management', 'Other'];
const VISIBILITY_OPTIONS = ['public', 'private', 'selected'];

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    imageUrl: '',
    phoneNumber: '',
    bio: '',
    address: '',
    skill: [],
    visibility: 'public',
    selectedUsers: [],
    skillsVisibility: true,
    projectsVisibility: true,
  });
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState('');
  const [editingSkillIndex, setEditingSkillIndex] = useState(null);
  const [skillForm, setSkillForm] = useState({ name: '', proficiency: 'beginner', category: 'Programming', isVisible: true });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const data = await getProfile();
      if (data && data.data) {
        setProfile(data.data);
        const skills = data.data.skill || [];
        setFormData({
          name: data.data.name || '',
          imageUrl: data.data.imageUrl || '',
          phoneNumber: data.data.phoneNumber || '',
          bio: data.data.bio || '',
          address: data.data.address || '',
          skill: skills,
          visibility: data.data.visibility || 'public',
          selectedUsers: data.data.selectedUsers || [],
          skillsVisibility: data.data.skillsVisibility !== undefined ? data.data.skillsVisibility : true,
          projectsVisibility: data.data.projectsVisibility !== undefined ? data.data.projectsVisibility : true,
        });
      }
    } catch (err) {
      console.log('No profile found or error fetching profile', err);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSkillFormChange = (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value;
    setSkillForm({ ...skillForm, [e.target.name]: value });
  };

  const addSkill = () => {
    if (!skillForm.name.trim()) {
      setMessage('Skill name is required');
      return;
    }
    const newSkills = [...formData.skill, { ...skillForm }];
    setFormData({ ...formData, skill: newSkills });
    setSkillForm({ name: '', proficiency: 'beginner', category: 'Programming', isVisible: true });
    setMessage('');
  };

  const editSkill = (index) => {
    setEditingSkillIndex(index);
    setSkillForm({ ...formData.skill[index] });
  };

  const updateSkill = () => {
    if (!skillForm.name.trim()) {
      setMessage('Skill name is required');
      return;
    }
    const newSkills = [...formData.skill];
    newSkills[editingSkillIndex] = { ...skillForm };
    setFormData({ ...formData, skill: newSkills });
    setEditingSkillIndex(null);
    setSkillForm({ name: '', proficiency: 'beginner', category: 'Programming', isVisible: true });
    setMessage('');
  };

  const removeSkill = (index) => {
    const newSkills = formData.skill.filter((_, i) => i !== index);
    setFormData({ ...formData, skill: newSkills });
  };

  const cancelSkillEdit = () => {
    setEditingSkillIndex(null);
    setSkillForm({ name: '', proficiency: 'beginner', category: 'Programming', isVisible: true });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    const payload = {
      ...formData,
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
      if (err.response?.data?.message === "Profile already exists") {
        try {
          await updateProfile(payload);
          setMessage('Profile updated successfully');
          setIsEditing(false);
          loadProfile();
        } catch (updateErr) {
          setMessage('Failed to save profile');
        }
      } else {
        setMessage('Failed to save profile: ' + (err.response?.data?.message || err.message));
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
      <div className="mx-auto max-w-4xl overflow-hidden rounded-lg border border-border bg-card shadow">
        <div className="p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-foreground">My Profile</h2>
            <button
              onClick={() => {
                setIsEditing(!isEditing);
                setEditingSkillIndex(null);
                setSkillForm({ name: '', proficiency: 'beginner', category: 'Programming', isVisible: true });
                setMessage('');
              }}
              className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground"
            >
              {isEditing ? 'Cancel' : 'Edit'}
            </button>
          </div>

          {message && (
            <div className={`mt-4 ${message.includes('successfully') ? 'text-green-500' : 'text-red-500'}`}>
              {message}
            </div>
          )}

          {isEditing ? (
            <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
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

              {/* Skills Management */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-medium text-foreground mb-4">Skills</h3>
                {formData.skill.map((skill, index) => (
                  <div key={index} className="mb-3 p-3 bg-secondary rounded-lg flex items-center justify-between">
                    <div className="flex-1">
                      <div className="font-medium">{skill.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {skill.category} • {skill.proficiency}
                        {skill.isVisible === false && ' • Hidden'}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => editSkill(index)}
                        className="px-3 py-1 text-xs bg-blue-500 text-white rounded"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => removeSkill(index)}
                        className="px-3 py-1 text-xs bg-red-500 text-white rounded"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
                
                {editingSkillIndex === null ? (
                  <div className="border p-4 rounded-lg space-y-3">
                    <h4 className="font-medium">Add New Skill</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-foreground">Skill Name</label>
                        <input
                          name="name"
                          type="text"
                          className="mt-1 block w-full rounded-md border border-input bg-background p-2 text-foreground"
                          value={skillForm.name}
                          onChange={handleSkillFormChange}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground">Category</label>
                        <select
                          name="category"
                          className="mt-1 block w-full rounded-md border border-input bg-background p-2 text-foreground"
                          value={skillForm.category}
                          onChange={handleSkillFormChange}
                        >
                          {CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground">Proficiency</label>
                        <select
                          name="proficiency"
                          className="mt-1 block w-full rounded-md border border-input bg-background p-2 text-foreground"
                          value={skillForm.proficiency}
                          onChange={handleSkillFormChange}
                        >
                          {PROFICIENCY_LEVELS.map(level => (
                            <option key={level} value={level}>{level.charAt(0).toUpperCase() + level.slice(1)}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex items-end">
                        <label className="flex items-center gap-2">
                          <input
                            name="isVisible"
                            type="checkbox"
                            checked={skillForm.isVisible}
                            onChange={handleSkillFormChange}
                          />
                          <span className="text-sm text-foreground">Visible on profile</span>
                        </label>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={addSkill}
                      className="px-4 py-2 bg-primary text-primary-foreground rounded"
                    >
                      Add Skill
                    </button>
                  </div>
                ) : (
                  <div className="border p-4 rounded-lg space-y-3">
                    <h4 className="font-medium">Edit Skill</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-medium text-foreground">Skill Name</label>
                        <input
                          name="name"
                          type="text"
                          className="mt-1 block w-full rounded-md border border-input bg-background p-2 text-foreground"
                          value={skillForm.name}
                          onChange={handleSkillFormChange}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground">Category</label>
                        <select
                          name="category"
                          className="mt-1 block w-full rounded-md border border-input bg-background p-2 text-foreground"
                          value={skillForm.category}
                          onChange={handleSkillFormChange}
                        >
                          {CATEGORIES.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-foreground">Proficiency</label>
                        <select
                          name="proficiency"
                          className="mt-1 block w-full rounded-md border border-input bg-background p-2 text-foreground"
                          value={skillForm.proficiency}
                          onChange={handleSkillFormChange}
                        >
                          {PROFICIENCY_LEVELS.map(level => (
                            <option key={level} value={level}>{level.charAt(0).toUpperCase() + level.slice(1)}</option>
                          ))}
                        </select>
                      </div>
                      <div className="flex items-end">
                        <label className="flex items-center gap-2">
                          <input
                            name="isVisible"
                            type="checkbox"
                            checked={skillForm.isVisible}
                            onChange={handleSkillFormChange}
                          />
                          <span className="text-sm text-foreground">Visible on profile</span>
                        </label>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={updateSkill}
                        className="px-4 py-2 bg-green-500 text-white rounded"
                      >
                        Update Skill
                      </button>
                      <button
                        type="button"
                        onClick={cancelSkillEdit}
                        className="px-4 py-2 bg-gray-500 text-white rounded"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Visibility Settings */}
              <div className="border-t pt-4">
                <h3 className="text-lg font-medium text-foreground mb-4">Profile Visibility</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Profile Visibility</label>
                    <select
                      name="visibility"
                      className="block w-full rounded-md border border-input bg-background p-2 text-foreground"
                      value={formData.visibility}
                      onChange={handleChange}
                    >
                      {VISIBILITY_OPTIONS.map(opt => (
                        <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
                      ))}
                    </select>
                    <p className="text-xs text-muted-foreground mt-1">
                      {formData.visibility === 'public' && 'Anyone can view your profile'}
                      {formData.visibility === 'private' && 'Only you can view your profile'}
                      {formData.visibility === 'selected' && 'Only selected users can view your profile'}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      name="skillsVisibility"
                      type="checkbox"
                      checked={formData.skillsVisibility}
                      onChange={(e) => setFormData({ ...formData, skillsVisibility: e.target.checked })}
                    />
                    <label className="text-sm text-foreground">Show skills on profile</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input
                      name="projectsVisibility"
                      type="checkbox"
                      checked={formData.projectsVisibility}
                      onChange={(e) => setFormData({ ...formData, projectsVisibility: e.target.checked })}
                    />
                    <label className="text-sm text-foreground">Show projects on profile</label>
                  </div>
                </div>
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
                  <p className="text-xs text-muted-foreground mt-1">
                    Visibility: {profile.visibility || 'public'}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Phone</h4>
                  <p className="text-foreground">{profile.phoneNumber || 'N/A'}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-muted-foreground">Role</h4>
                  <p className="text-foreground capitalize">{profile.auth?.role || 'N/A'}</p>
                </div>
                <div className="col-span-1 sm:col-span-2">
                  <h4 className="text-sm font-medium text-muted-foreground">About</h4>
                  <p className="text-foreground">{profile.bio || 'N/A'}</p>
                </div>
                <div className="col-span-1 sm:col-span-2 space-y-4">
                  <div>
                    <h4 className="text-sm font-medium text-muted-foreground mb-2">Performance Rating</h4>
                    <div className="flex items-center gap-4">
                      <div className="text-center">
                        <span className="text-4xl font-black text-foreground">
                          {profile.averageRating?.toFixed(1) || '0.0'}
                        </span>
                        <div className="flex justify-center mt-1">
                          <StarRating rating={profile.averageRating || 0} readonly size="sm" />
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {profile.totalRatings || 0} total reviews
                        </p>
                      </div>
                      <div className="flex-1 max-w-xs space-y-1">
                        {[5, 4, 3, 2, 1].map((star) => {
                          const count = profile.ratingsBreakdown?.[star] || 0;
                          const total = profile.totalRatings || 0;
                          const percent = total > 0 ? (count / total) * 100 : 0;
                          return (
                            <div key={star} className="flex items-center gap-2 text-xs">
                              <span className="w-3">{star}★</span>
                              <div className="flex-1 h-2 bg-secondary rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-yellow-400 rounded-full"
                                  style={{ width: `${percent}%` }}
                                />
                              </div>
                              <span className="w-6 text-right text-muted-foreground">{count}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="col-span-1 sm:col-span-2">
                  <h4 className="text-sm font-medium text-muted-foreground">Address</h4>
                  <p className="text-foreground">{profile.address || 'N/A'}</p>
                </div>
                <div className="col-span-1 sm:col-span-2">
                  <h4 className="text-sm font-medium text-muted-foreground mb-2">Skills</h4>
                  <div className="flex flex-wrap gap-2">
                    {profile.skill && profile.skill.length > 0 ? (
                      profile.skill.map((skill, i) => {
                        if (typeof skill === 'string') {
                          return (
                            <span key={i} className="inline-flex items-center rounded-full border border-border px-2.5 py-0.5 text-xs font-semibold text-foreground">
                              {skill}
                            </span>
                          );
                        }
                        return (
                          <div key={i} className="inline-flex flex-col rounded-lg border border-border px-3 py-2 bg-secondary">
                            <span className="text-xs font-semibold text-foreground">{skill.name}</span>
                            <span className="text-xs text-muted-foreground">{skill.category} • {skill.proficiency}</span>
                          </div>
                        );
                      })
                    ) : (
                      <span className="text-muted-foreground">No skills added</span>
                    )}
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
