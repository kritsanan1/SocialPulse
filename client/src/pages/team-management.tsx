
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '../components/ui/avatar';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Users, UserPlus, Settings, Crown, Shield, User, MoreHorizontal, Mail, Calendar } from 'lucide-react';
import { useToast } from '../hooks/use-toast';
import { format } from 'date-fns';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'admin' | 'editor' | 'viewer';
  status: 'active' | 'pending' | 'inactive';
  avatar_url?: string;
  joined_at: Date;
  last_active: Date;
  permissions: string[];
}

interface TeamInvite {
  id: string;
  email: string;
  role: 'admin' | 'editor' | 'viewer';
  invited_by: string;
  invited_at: Date;
  expires_at: Date;
  status: 'pending' | 'accepted' | 'expired';
}

export default function TeamManagement() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [teamInvites, setTeamInvites] = useState<TeamInvite[]>([]);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Form state
  const [inviteForm, setInviteForm] = useState({
    email: '',
    role: 'viewer' as 'admin' | 'editor' | 'viewer',
    message: ''
  });

  const roles = [
    {
      id: 'owner',
      name: 'Owner',
      description: 'Full access to everything including billing',
      icon: Crown,
      color: 'text-yellow-600',
      permissions: ['all']
    },
    {
      id: 'admin',
      name: 'Admin',
      description: 'Manage team, settings, and all content',
      icon: Shield,
      color: 'text-blue-600',
      permissions: ['manage_team', 'manage_content', 'view_analytics', 'manage_settings']
    },
    {
      id: 'editor',
      name: 'Editor',
      description: 'Create and manage content, view analytics',
      icon: User,
      color: 'text-green-600',
      permissions: ['manage_content', 'view_analytics']
    },
    {
      id: 'viewer',
      name: 'Viewer',
      description: 'View content and basic analytics only',
      icon: User,
      color: 'text-gray-600',
      permissions: ['view_content', 'view_analytics']
    }
  ];

  useEffect(() => {
    fetchTeamData();
  }, []);

  const fetchTeamData = async () => {
    try {
      const [membersResponse, invitesResponse] = await Promise.all([
        fetch('/api/team/members'),
        fetch('/api/team/invites')
      ]);

      if (membersResponse.ok) {
        const membersData = await membersResponse.json();
        setTeamMembers(membersData.members.map((member: any) => ({
          ...member,
          joined_at: new Date(member.joined_at),
          last_active: new Date(member.last_active)
        })));
      }

      if (invitesResponse.ok) {
        const invitesData = await invitesResponse.json();
        setTeamInvites(invitesData.invites.map((invite: any) => ({
          ...invite,
          invited_at: new Date(invite.invited_at),
          expires_at: new Date(invite.expires_at)
        })));
      }
    } catch (error) {
      console.error('Failed to fetch team data:', error);
    }
  };

  const handleSendInvite = async () => {
    if (!inviteForm.email.trim()) {
      toast({
        title: "Error",
        description: "Please enter an email address",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/team/invite', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inviteForm)
      });

      if (!response.ok) throw new Error('Failed to send invite');

      toast({
        title: "Success",
        description: "Invitation sent successfully",
      });

      setIsInviteDialogOpen(false);
      setInviteForm({ email: '', role: 'viewer', message: '' });
      fetchTeamData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send invitation",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateMemberRole = async (memberId: string, newRole: string) => {
    try {
      const response = await fetch(`/api/team/members/${memberId}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole })
      });

      if (!response.ok) throw new Error('Failed to update role');

      toast({
        title: "Success",
        description: "Member role updated successfully",
      });

      fetchTeamData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update member role",
        variant: "destructive"
      });
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    try {
      const response = await fetch(`/api/team/members/${memberId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to remove member');

      toast({
        title: "Success",
        description: "Member removed successfully",
      });

      fetchTeamData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to remove member",
        variant: "destructive"
      });
    }
  };

  const handleCancelInvite = async (inviteId: string) => {
    try {
      const response = await fetch(`/api/team/invites/${inviteId}`, {
        method: 'DELETE'
      });

      if (!response.ok) throw new Error('Failed to cancel invite');

      toast({
        title: "Success",
        description: "Invitation cancelled",
      });

      fetchTeamData();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel invitation",
        variant: "destructive"
      });
    }
  };

  const getRoleInfo = (roleId: string) => {
    return roles.find(role => role.id === roleId) || roles[3]; // Default to viewer
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'pending': return 'bg-yellow-500';
      case 'inactive': return 'bg-gray-500';
      default: return 'bg-gray-500';
    }
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-6 w-6 text-blue-500" />
          <h1 className="text-2xl font-bold">Team Management</h1>
        </div>
        
        <Dialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="h-4 w-4 mr-2" />
              Invite Member
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Invite Team Member</DialogTitle>
              <DialogDescription>
                Send an invitation to join your team
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="colleague@company.com"
                  value={inviteForm.email}
                  onChange={(e) => setInviteForm(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="role">Role</Label>
                <Select value={inviteForm.role} onValueChange={(value: any) => setInviteForm(prev => ({ ...prev, role: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.slice(1).map(role => ( // Exclude owner role
                      <SelectItem key={role.id} value={role.id}>
                        <div className="flex items-center gap-2">
                          <role.icon className={`h-4 w-4 ${role.color}`} />
                          <div>
                            <div className="font-medium">{role.name}</div>
                            <div className="text-xs text-muted-foreground">{role.description}</div>
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="message">Personal Message (optional)</Label>
                <Input
                  id="message"
                  placeholder="Welcome to the team!"
                  value={inviteForm.message}
                  onChange={(e) => setInviteForm(prev => ({ ...prev, message: e.target.value }))}
                />
              </div>

              <div className="flex gap-3">
                <Button onClick={() => setIsInviteDialogOpen(false)} variant="outline">
                  Cancel
                </Button>
                <Button onClick={handleSendInvite} disabled={isLoading}>
                  {isLoading ? 'Sending...' : 'Send Invitation'}
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="members" className="space-y-6">
        <TabsList>
          <TabsTrigger value="members">Team Members</TabsTrigger>
          <TabsTrigger value="invites">Pending Invites</TabsTrigger>
          <TabsTrigger value="roles">Roles & Permissions</TabsTrigger>
        </TabsList>

        <TabsContent value="members">
          <Card>
            <CardHeader>
              <CardTitle>Team Members ({teamMembers.length})</CardTitle>
              <CardDescription>
                Manage your team members and their access levels
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Member</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {teamMembers.map((member) => {
                    const roleInfo = getRoleInfo(member.role);
                    return (
                      <TableRow key={member.id}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar>
                              <AvatarImage src={member.avatar_url} />
                              <AvatarFallback>
                                {member.name.split(' ').map(n => n[0]).join('')}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{member.name}</div>
                              <div className="text-sm text-muted-foreground">{member.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <roleInfo.icon className={`h-4 w-4 ${roleInfo.color}`} />
                            <span className="font-medium">{roleInfo.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary" className={getStatusColor(member.status)}>
                            {member.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            {format(member.last_active, 'MMM d, yyyy')}
                          </div>
                        </TableCell>
                        <TableCell>
                          {member.role !== 'owner' && (
                            <div className="flex gap-2">
                              <Select
                                value={member.role}
                                onValueChange={(value) => handleUpdateMemberRole(member.id, value)}
                              >
                                <SelectTrigger className="w-32">
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {roles.slice(1).map(role => (
                                    <SelectItem key={role.id} value={role.id}>
                                      {role.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleRemoveMember(member.id)}
                              >
                                Remove
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invites">
          <Card>
            <CardHeader>
              <CardTitle>Pending Invitations ({teamInvites.length})</CardTitle>
              <CardDescription>
                Manage outstanding team invitations
              </CardDescription>
            </CardHeader>
            <CardContent>
              {teamInvites.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Mail className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No pending invitations</p>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Email</TableHead>
                      <TableHead>Role</TableHead>
                      <TableHead>Invited</TableHead>
                      <TableHead>Expires</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {teamInvites.map((invite) => {
                      const roleInfo = getRoleInfo(invite.role);
                      return (
                        <TableRow key={invite.id}>
                          <TableCell>{invite.email}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <roleInfo.icon className={`h-4 w-4 ${roleInfo.color}`} />
                              <span>{roleInfo.name}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            {format(invite.invited_at, 'MMM d, yyyy')}
                          </TableCell>
                          <TableCell>
                            {format(invite.expires_at, 'MMM d, yyyy')}
                          </TableCell>
                          <TableCell>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleCancelInvite(invite.id)}
                            >
                              Cancel
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="roles">
          <div className="grid gap-4">
            {roles.map((role) => (
              <Card key={role.id}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <role.icon className={`h-8 w-8 ${role.color}`} />
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold">{role.name}</h3>
                      <p className="text-muted-foreground mb-3">{role.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {role.permissions.map((permission) => (
                          <Badge key={permission} variant="outline">
                            {permission.replace('_', ' ')}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
