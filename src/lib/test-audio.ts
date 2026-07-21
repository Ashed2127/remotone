import { audioGenerator } from './audio-generator';

/**
 * Test script for audio generation
 * Run with: npx ts-node src/lib/test-audio.ts
 */

async function testAudioGeneration() {
  console.log('🎵 Testing Audio Generation with Tone.js');
  
  try {
    // Test 1: Initialize audio
    console.log('\n1. Initializing audio generator...');
    await audioGenerator.start();
    console.log('✅ Audio generator initialized');
    
    // Test 2: Check available sound types
    console.log('\n2. Available sound types:');
    const soundTypes = audioGenerator.getAvailableSoundTypes();
    console.log(soundTypes.join(', '));
    
    // Test 3: Generate a melody
    console.log('\n3. Generating melody:');
    const melody = audioGenerator.generateMelody('test');
    console.log('Generated melody:', melody);
    
    // Test 4: Generate chord progression
    console.log('\n4. Generating chord progression:');
    const chords = audioGenerator.generateChordProgression();
    console.log('Generated chords:', chords);
    
    // Test 5: Preview different sound types
    console.log('\n5. Previewing sound types:');
    for (const soundType of soundTypes) {
      console.log(`   - Previewing ${soundType}...`);
      await audioGenerator.previewSoundType(soundType, 1);
      await new Promise(resolve => setTimeout(resolve, 1500));
    }
    
    console.log('\n✅ All audio tests completed successfully!');
    
    // Cleanup
    setTimeout(() => {
      audioGenerator.stop();
      console.log('🔇 Audio stopped');
    }, 2000);
    
  } catch (error) {
    console.error('❌ Audio test failed:', error);
    audioGenerator.stop();
  }
}

// Run tests if executed directly
if (require.main === module) {
  testAudioGeneration();
}

export { testAudioGeneration };