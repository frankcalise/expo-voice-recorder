import React from "react";
import { ThemedView } from "@/components/ThemedView";
import {
  AudioModule,
  AudioQuality,
  RecordingOptions,
  useAudioPlayer,
  useAudioRecorder,
  RecordingStatus,
} from "expo-audio";
import { Alert, Button, ViewStyle } from "react-native";
import { ThemedText } from "@/components/ThemedText";

const RECORDING_OPTS: RecordingOptions = {
  extension: ".wav",
  sampleRate: 16000,
  numberOfChannels: 1,
  bitRate: 64000,
  android: {
    outputFormat: "3gp",
    audioEncoder: "aac",
  },
  ios: {
    audioQuality: 0,
    outputFormat: AudioQuality.MEDIUM,
    linearPCMBitDepth: 16,
    linearPCMIsBigEndian: false,
    linearPCMIsFloat: false,
  },
};

export default function RecordScreen() {
  const [recordingStatus, setRecordingStatus] = React.useState<RecordingStatus>(
    {
      id: 0,
      hasError: false,
      error: null,
      isFinished: false,
      url: null,
    }
  );

  const [recordedUri, setRecordedUri] = React.useState<string | null>(null);

  const audioRecorder = useAudioRecorder(RECORDING_OPTS, setRecordingStatus);
  const player = useAudioPlayer(recordedUri);

  const handleRecord = async () => {
    try {
      await audioRecorder.prepareToRecordAsync(RECORDING_OPTS);
      audioRecorder.record();
      setRecordingStatus((prev) => ({ ...prev, isRecording: true }));
    } catch (error) {
      console.error("Recording failed:", error);
    }
  };

  const handleStopRecording = async () => {
    await audioRecorder.stop();
    setRecordedUri(audioRecorder.uri);
    setRecordingStatus((prev) => ({ ...prev, isRecording: false }));
  };

  const handlePlay = () => {
    player.play();
  };

  React.useEffect(() => {
    const requestMicrophonePermission = async () => {
      const status = await AudioModule.requestRecordingPermissionsAsync();
      if (!status.granted) {
        Alert.alert("Permission to access microphone was denied");
      }
    };

    requestMicrophonePermission();
  }, []);

  return (
    <ThemedView style={$container}>
      <ThemedText>{JSON.stringify(recordingStatus, null, 2)}</ThemedText>

      <Button
        title={audioRecorder.isRecording ? "Stop Recording" : "Start Recording"}
        onPress={audioRecorder.isRecording ? handleStopRecording : handleRecord}
      />

      <Button
        title="Stop Recording"
        onPress={handleStopRecording}
        disabled={!audioRecorder.isRecording}
      />

      <ThemedText>Recording at: {recordedUri}</ThemedText>

      <Button title="Play" onPress={handlePlay} disabled={!recordedUri} />
    </ThemedView>
  );
}

const $container: ViewStyle = {
  flex: 1,
  alignContent: "center",
  justifyContent: "center",
};
