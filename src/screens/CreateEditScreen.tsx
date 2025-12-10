import React, { useState, useEffect } from "react";
import { View, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { TextInput, Button, Appbar } from "react-native-paper";
import { api } from "../services/api";
import { Task } from "../types/Task";
import DateTimePicker from "@react-native-community/datetimepicker";

export default function CreateEditScreen({ navigation, route }: any) {
  const taskParam: Task | undefined = route.params?.task;

  const [title, setTitle] = useState(taskParam?.title ?? "");
  const [description, setDescription] = useState(taskParam?.description ?? "");
  const [deadline, setDeadline] = useState<Date | undefined>(
    taskParam?.deadline ? new Date(taskParam.deadline) : undefined
  );
  const [showDatePicker, setShowDatePicker] = useState(false);

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerShown: false,
    });
  }, [navigation]);

  const save = async () => {
    if (!title.trim()) return;

    try {
      setSaving(true);

      const payload = {
        title,
        description,
        deadline: deadline ? deadline.toISOString() : null,
      };

      if (taskParam) {
        await api.put(`/tasks/${taskParam._id}`, payload);
      } else {
        await api.post("/tasks", payload);
      }

      navigation.goBack();
    } catch (err) {
      console.error("Erro ao salvar:", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title={taskParam ? "Editar tarefa" : "Nova tarefa"} />
      </Appbar.Header>

      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <View style={styles.form}>

          <TextInput
            label="Título"
            value={title}
            onChangeText={setTitle}
            mode="outlined"
            style={styles.input}
          />

          <TextInput
            label="Descrição"
            value={description}
            onChangeText={setDescription}
            mode="outlined"
            multiline
            numberOfLines={4}
            style={styles.input}
          />

          <TextInput
            label="Data limite"
            value={deadline ? deadline.toLocaleDateString() : ""}
            mode="outlined"
            editable={false}
            right={
              <TextInput.Icon
                icon="calendar"
                onPress={() => setShowDatePicker(true)}
              />
            }
            style={styles.input}
          />

          {showDatePicker && (
            <DateTimePicker
              value={deadline ?? new Date()}
              mode="date"
              display="default"
              onChange={(_, selectedDate: Date | undefined) => {
                setShowDatePicker(false);
                if (selectedDate) setDeadline(selectedDate);
              }}
            />
          )}

          {taskParam && (
            <TextInput
              label="Criada em"
              mode="outlined"
              value={new Date(taskParam.createdAt).toLocaleString()}
              editable={false}
              style={styles.input}
            />
          )}

          <Button
            mode="contained"
            onPress={save}
            loading={saving}
            style={{ marginTop: 16 }}
          >
            Salvar
          </Button>
        </View>
      </KeyboardAvoidingView>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f2f2f2" },
  form: { padding: 16, marginTop: 20 },
  input: { marginBottom: 16 }
});
