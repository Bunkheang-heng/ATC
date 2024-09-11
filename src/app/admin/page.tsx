"use client";

import React, { useState } from 'react';
import { db, storage } from '../../../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { TextField, Button, Typography, Box, Paper, Grid, IconButton, RadioGroup, FormControlLabel, Radio, Snackbar, Container } from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import AddIcon from '@mui/icons-material/Add';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

interface Team {
  name: string;
  logo: File | null;
  logoUrl: string;
  logoType: 'file' | 'url';
  members: string[];
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(function Alert(
  props,
  ref,
) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function Admin() {
  const [team, setTeam] = useState<Team>({
    name: '',
    logo: null,
    logoUrl: '',
    logoType: 'file',
    members: ['']
  });
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const handleTeamChange = (field: keyof Team, value: any) => {
    setTeam(prevTeam => ({ ...prevTeam, [field]: value }));
  };

  const handleMemberChange = (memberIndex: number, value: string) => {
    setTeam(prevTeam => {
      const newMembers = [...prevTeam.members];
      newMembers[memberIndex] = value;
      return { ...prevTeam, members: newMembers };
    });
  };

  const addMember = () => {
    setTeam(prevTeam => ({
      ...prevTeam,
      members: [...prevTeam.members, '']
    }));
  };

  const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSnackbar(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      let logoUrl = team.logoUrl;
      if (team.logoType === 'file' && team.logo) {
        const logoRef = ref(storage, `teamLogos/${team.name}-${Date.now()}`);
        await uploadBytes(logoRef, team.logo);
        logoUrl = await getDownloadURL(logoRef);
      }

      await addDoc(collection(db, 'teams'), {
        name: team.name,
        logo: logoUrl,
        members: team.members.filter(member => member.trim() !== '')
      });

      console.log('Team saved successfully');
      setOpenSnackbar(true);
      // Reset form
      setTeam({
        name: '',
        logo: null,
        logoUrl: '',
        logoType: 'file',
        members: ['']
      });
    } catch (error) {
      console.error('Error saving team:', error);
      // Show error message to user
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom align="center" sx={{ mb: 4 }}>Admin Dashboard</Typography>
        <form onSubmit={handleSubmit}>
          <Paper elevation={3} sx={{ p: 4, mb: 4 }}>
            <Typography variant="h5" gutterBottom sx={{ mb: 3 }}>Team Information</Typography>
            <TextField
              fullWidth
              label="Team Name"
              value={team.name}
              onChange={(e) => handleTeamChange('name', e.target.value)}
              margin="normal"
              variant="outlined"
            />
            <Typography variant="h6" gutterBottom sx={{ mt: 3, mb: 2 }}>Team Logo</Typography>
            <RadioGroup
              row
              value={team.logoType}
              onChange={(e) => handleTeamChange('logoType', e.target.value)}
            >
              <FormControlLabel value="file" control={<Radio />} label="Upload File" />
              <FormControlLabel value="url" control={<Radio />} label="Provide URL" />
            </RadioGroup>
            {team.logoType === 'file' ? (
              <Button
                variant="contained"
                component="label"
                startIcon={<CloudUploadIcon />}
                sx={{ mt: 2, mb: 2 }}
              >
                Upload Logo
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => handleTeamChange('logo', e.target.files?.[0] || null)}
                />
              </Button>
            ) : (
              <TextField
                fullWidth
                label="Logo URL"
                value={team.logoUrl}
                onChange={(e) => handleTeamChange('logoUrl', e.target.value)}
                margin="normal"
                variant="outlined"
              />
            )}
            <Typography variant="h6" gutterBottom sx={{ mt: 3, mb: 2 }}>Team Members</Typography>
            {team.members.map((member, memberIndex) => (
              <TextField
                key={memberIndex}
                fullWidth
                label={`Member ${memberIndex + 1}`}
                value={member}
                onChange={(e) => handleMemberChange(memberIndex, e.target.value)}
                margin="normal"
                variant="outlined"
              />
            ))}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <IconButton onClick={addMember} color="primary" size="large">
                <AddIcon />
              </IconButton>
            </Box>
          </Paper>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Button type="submit" variant="contained" color="primary" size="large" sx={{ mt: 2, px: 4, py: 1 }}>
              Save Team
            </Button>
          </Box>
        </form>
        <Snackbar open={openSnackbar} autoHideDuration={6000} onClose={handleCloseSnackbar}>
          <Alert onClose={handleCloseSnackbar} severity="success" sx={{ width: '100%' }}>
            Team uploaded successfully!
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
}
