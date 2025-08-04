import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Settings as SettingsIcon, User, Bell, Palette, Shield } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

const Settings = () => {
  const [profileSettings, setProfileSettings] = useState({
    username: 'admin',
    email: 'admin@digitallibrary.com',
    fullName: 'Library Administrator'
  });

  const [preferences, setPreferences] = useState({
    theme: 'system',
    notifications: true,
    emailUpdates: false,
    autoSave: true
  });

  const [librarySettings, setLibrarySettings] = useState({
    maxBooksPerUser: 5,
    loanDuration: 14,
    allowReservations: true,
    publicAccess: false
  });

  const handleProfileSave = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile settings have been saved successfully.",
    });
  };

  const handlePreferencesSave = () => {
    toast({
      title: "Preferences Updated", 
      description: "Your preferences have been saved successfully.",
    });
  };

  const handleLibrarySettingsSave = () => {
    toast({
      title: "Library Settings Updated",
      description: "Library configuration has been saved successfully.",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-2 bg-primary/10 rounded-lg">
          <SettingsIcon className="h-6 w-6 text-primary" />
        </div>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground">
            Manage your account and application preferences
          </p>
        </div>
      </div>

      {/* Profile Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="h-5 w-5" />
            <CardTitle>Profile Settings</CardTitle>
          </div>
          <CardDescription>
            Update your personal information and account details
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={profileSettings.username}
                onChange={(e) => setProfileSettings(prev => ({ ...prev, username: e.target.value }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={profileSettings.email}
                onChange={(e) => setProfileSettings(prev => ({ ...prev, email: e.target.value }))}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="fullName">Full Name</Label>
            <Input
              id="fullName"
              value={profileSettings.fullName}
              onChange={(e) => setProfileSettings(prev => ({ ...prev, fullName: e.target.value }))}
            />
          </div>
          <Button onClick={handleProfileSave}>Save Profile</Button>
        </CardContent>
      </Card>

      {/* Application Preferences */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            <CardTitle>Application Preferences</CardTitle>
          </div>
          <CardDescription>
            Customize your application experience
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Theme</Label>
              <p className="text-sm text-muted-foreground">Choose your preferred theme</p>
            </div>
            <Select value={preferences.theme} onValueChange={(value) => setPreferences(prev => ({ ...prev, theme: value }))}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Push Notifications</Label>
              <p className="text-sm text-muted-foreground">Receive notifications for important updates</p>
            </div>
            <Switch
              checked={preferences.notifications}
              onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, notifications: checked }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Email Updates</Label>
              <p className="text-sm text-muted-foreground">Receive email notifications</p>
            </div>
            <Switch
              checked={preferences.emailUpdates}
              onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, emailUpdates: checked }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Auto-save</Label>
              <p className="text-sm text-muted-foreground">Automatically save changes</p>
            </div>
            <Switch
              checked={preferences.autoSave}
              onCheckedChange={(checked) => setPreferences(prev => ({ ...prev, autoSave: checked }))}
            />
          </div>

          <Button onClick={handlePreferencesSave}>Save Preferences</Button>
        </CardContent>
      </Card>

      {/* Library Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            <CardTitle>Library Configuration</CardTitle>
          </div>
          <CardDescription>
            Configure library-wide settings and policies
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="maxBooks">Max Books Per User</Label>
              <Input
                id="maxBooks"
                type="number"
                min="1"
                max="20"
                value={librarySettings.maxBooksPerUser}
                onChange={(e) => setLibrarySettings(prev => ({ ...prev, maxBooksPerUser: parseInt(e.target.value) || 5 }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="loanDuration">Loan Duration (days)</Label>
              <Input
                id="loanDuration"
                type="number"
                min="1"
                max="90"
                value={librarySettings.loanDuration}
                onChange={(e) => setLibrarySettings(prev => ({ ...prev, loanDuration: parseInt(e.target.value) || 14 }))}
              />
            </div>
          </div>

          <Separator />

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Allow Reservations</Label>
              <p className="text-sm text-muted-foreground">Users can reserve books that are currently borrowed</p>
            </div>
            <Switch
              checked={librarySettings.allowReservations}
              onCheckedChange={(checked) => setLibrarySettings(prev => ({ ...prev, allowReservations: checked }))}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <Label>Public Access</Label>
              <p className="text-sm text-muted-foreground">Allow public browsing without login</p>
            </div>
            <Switch
              checked={librarySettings.publicAccess}
              onCheckedChange={(checked) => setLibrarySettings(prev => ({ ...prev, publicAccess: checked }))}
            />
          </div>

          <Button onClick={handleLibrarySettingsSave}>Save Library Settings</Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default Settings;