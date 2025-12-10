// src/screens/HomeScreen.tsx
import React, { useEffect, useState, useCallback } from "react";
import { View, FlatList, RefreshControl, StyleSheet } from "react-native";
import { FAB, Appbar, useTheme, ActivityIndicator, Text, TextInput } from "react-native-paper";
import { api } from "../services/api";
import TaskItem from "../components/TaskItem";
import { Task } from "../types/Task";

export default function HomeScreen({ navigation }: any) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [search, setSearch] = useState("");
  const [filteredTasks, setFilteredTasks] = useState<Task[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);

  const theme = useTheme();

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get<Task[]>("/tasks");
      setTasks(res.data);
    } catch (err) {
      console.error("Erro ao carregar tasks:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
    const unsubscribe = navigation.addListener("focus", load);
    return unsubscribe;
  }, [navigation, load]);

  const onRefresh = async () => {
    setRefreshing(true);
    await load();
    setRefreshing(false);
  };

  const toggleDone = async (task: Task) => {
    try {
      await api.put(`/tasks/${task._id}`, { done: !task.done });
      await load();
    } catch (err) {
      console.error("Erro toggling:", err);
    }
  };

  const remove = async (id: string) => {
    try {
      await api.delete(`/tasks/${id}`);
      await load();
    } catch (err) {
      console.error("Erro ao deletar:", err);
    }
  };

  const edit = (task: Task) => {
    navigation.navigate("CreateEdit", { task });
  };

  // Busca no backend com debounce
  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (search.trim() === "") {
        setFilteredTasks([]);
        return;
      }

      try {
        setSearchLoading(true);
        const res = await api.get(`/tasks/search?query=${search}`);
        setFilteredTasks(res.data);
      } catch (err) {
        console.log("Erro ao pesquisar:", err);
      } finally {
        setSearchLoading(false);
      }
    }, 400); // evita chamadas a cada tecla digitada

    return () => clearTimeout(timeout);
  }, [search]);

  const listToRender = search.length > 0 ? filteredTasks : tasks;

  return (
    <>
      <Appbar.Header>
        <Appbar.Content title="Tarefas" />
      </Appbar.Header>

      <View style={styles.container}>

        {/* Campo de busca */}
        <TextInput
          placeholder="Buscar tarefa..."
          value={search}
          onChangeText={setSearch}
          mode="outlined"
          style={{ margin: 12 }}
        />

        {searchLoading && (
          <ActivityIndicator animating style={{ marginBottom: 10 }} />
        )}

        {loading ? (
          <ActivityIndicator animating size="large" style={{ marginTop: 40 }} />

        ) : listToRender.length === 0 ? (
          <View style={styles.empty}>
            <Text>
              {search.length > 0
                ? "Nenhum resultado para sua busca."
                : "Nenhuma tarefa. Adicione uma com o botão +."}
            </Text>
          </View>

        ) : (
          <FlatList
            data={listToRender}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <TaskItem
                task={item}
                onToggle={toggleDone}
                onDelete={remove}
                onEdit={edit}
              />
            )}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
              />
            }
            contentContainerStyle={{ padding: 12 }}
          />
        )}

        <FAB
          icon="plus"
          style={[styles.fab, { backgroundColor: theme.colors.primary }]}
          onPress={() => navigation.navigate("CreateEdit")}
        />
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f2f2f2" },
  fab: { position: "absolute", right: 20, bottom: 20 },
  empty: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
});
