import React from "react";
import { View, StyleSheet } from "react-native";
import { Card, IconButton, Text, Checkbox } from "react-native-paper";
import { Task } from "../types/Task";

export default function TaskItem({ task, onToggle, onDelete, onEdit }: any) {
  const deadline = task.deadline ? new Date(task.deadline).toLocaleDateString() : "Sem prazo";

  return (
    <Card style={styles.card}>
      <Card.Title
        title={task.title}
        subtitle={`Criada: ${new Date(task.createdAt).toLocaleDateString()}`}
        right={(props) => (
          <View style={{ flexDirection: "row" }}>
            <IconButton icon="pencil" onPress={() => onEdit(task)} />
            <IconButton icon="delete" onPress={() => onDelete(task._id)} />
          </View>
        )}
      />

      <Card.Content>
        {task.description?.trim() !== "" && (
          <Text style={styles.description}>{task.description}</Text>
        )}
        <Text style={styles.deadline}>Prazo: {deadline}</Text>
      </Card.Content>

      <Card.Actions>
        <Checkbox
          status={task.done ? "checked" : "unchecked"}
          onPress={() => onToggle(task)}
        />
        <Text>{task.done ? "Concluída" : "Pendente"}</Text>
      </Card.Actions>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: { marginBottom: 12 },
  description: { marginBottom: 6 },
  deadline: { fontSize: 12, color: "#666" }
});
