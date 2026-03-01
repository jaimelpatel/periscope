import { CameraView, useCameraPermissions } from 'expo-camera';
import { useState, useRef, useEffect } from 'react';
import { Button, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Audio } from 'expo-av';

export default function App() {
  const [facing, setFacing] = useState('back');
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [microphonePermission, setMicrophonePermission] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isCameraReady, setIsCameraReady] = useState(false);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Audio.requestPermissionsAsync();
      setMicrophonePermission(status === 'granted');
    })();
  }, []);

  if (!cameraPermission || microphonePermission === null) {
    // Camera or microphone permissions are still loading.
    return <View />;
  }

  if (!cameraPermission.granted || !microphonePermission) {
    // Camera or microphone permissions are not granted yet.
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: 'center' }}>We need your permission to show the camera and record audio</Text>
        <Button onPress={requestCameraPermission} title="Grant Camera Permission" />
        <Button onPress={async () => {
          const { status } = await Audio.requestPermissionsAsync();
          setMicrophonePermission(status === 'granted');
        }} title="Grant Microphone Permission" />
      </View>
    );
  }

  function toggleCameraFacing() {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  }

  async function startRecording() {
    if (cameraRef.current && isCameraReady) {
      try {
        setIsRecording(true);
        const { uri } = await cameraRef.current.recordAsync();
        console.log('Video saved to:', uri);
        // You can now do something with the video URI, e.g., save it to the gallery.
      } catch (e) {
        console.error("Recording failed:", e);
        setIsRecording(false);
      }
    }
  }

  function stopRecording() {
    if (cameraRef.current) {
      cameraRef.current.stopRecording();
      setIsRecording(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Mini Camera test</Text>
      <View style={styles.cameraContainer}>
        <CameraView
          style={styles.camera}
          facing={facing}
          ref={cameraRef}
          onCameraReady={() => setIsCameraReady(true)}
        />
      </View>

      <View style={styles.controlsContainer}>
        <TouchableOpacity style={[styles.button, styles.flipButton]} onPress={toggleCameraFacing}>
          <Text style={styles.text}>Flip</Text>
        </TouchableOpacity>

        {!isRecording ? (
          <TouchableOpacity
            style={[styles.button, styles.recordButton, !isCameraReady && styles.disabledButton]}
            onPress={startRecording}
            disabled={!isCameraReady}
          >
            <Text style={styles.text}>Start Recording</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={[styles.button, styles.stopButton]} onPress={stopRecording}>
            <Text style={styles.text}>Stop Recording</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  cameraContainer: {
    width: 300,
    height: 400,
    overflow: 'hidden',
    borderRadius: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#ddd',
  },
  camera: {
    flex: 1,
  },
  controlsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '80%',
  },
  button: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center'
  },
  flipButton: {
    backgroundColor: '#3498db',
  },
  recordButton: {
    backgroundColor: '#2ecc71',
  },
  stopButton: {
    backgroundColor: '#e74c3c',
  },
  disabledButton: {
    backgroundColor: '#95a5a6',
  },
  text: {
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
  },
});
