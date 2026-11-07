import React from 'react';
import IdentifyBird from './IdentifyBird';

export default function IdentifyAudio({ setSelectedSpeciesModal }) {
  return (
    <IdentifyBird 
      initialInputType="audio" 
      setSelectedSpeciesModal={setSelectedSpeciesModal} 
    />
  );
}
