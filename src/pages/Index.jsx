import React, { useState, useEffect } from "react";
import { Box, Button, Flex, Input, Text, VStack, useToast, Select, Link } from "@chakra-ui/react";
import { FaPlus, FaTrash } from "react-icons/fa";
import { client } from "lib/crud";

const Index = () => {
  const [notes, setNotes] = useState([]);
  const [sortType, setSortType] = useState("time");
  const [input, setInput] = useState("");
  const toast = useToast();

  useEffect(() => {
    fetchNotes();
  }, []);

  useEffect(() => {
    const sortedNotes = sortNotes(notes, sortType);
    setNotes(sortedNotes);
  }, [sortType !== "manual" ? sortType : null]);

  const sortNotes = (notes, type) => {
    switch (type) {
      case "text":
        return [...notes].sort((a, b) => a.text.localeCompare(b.text));
      case "time":
        return [...notes].sort((a, b) => parseInt(b.id.split(":")[1]) - parseInt(a.id.split(":")[1]));
      case "manual":
        return notes;
      default:
        return notes;
    }
  };

  const fetchNotes = async () => {
    const fetchedNotes = await client.getWithPrefix("note:");
    if (fetchedNotes) {
      const sortedFetchedNotes = sortNotes(
        fetchedNotes.map((note) => ({ id: note.key, ...note.value })),
        sortType,
      );
      setNotes(sortedFetchedNotes);
    }
  };

  const addNote = async () => {
    if (input.trim() === "") {
      toast({
        title: "Cannot add empty note",
        status: "warning",
        duration: 2000,
        isClosable: true,
      });
      return;
    }
    const noteId = `note:${Date.now()}`;
    const newNote = { id: noteId, text: input };
    const success = await client.set(noteId, { text: input });
    if (success) {
      setNotes([...notes, newNote]);
      setInput("");
      toast({
        title: "Note added",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  const deleteNote = async (id) => {
    const success = await client.delete(id);
    if (success) {
      setNotes(notes.filter((note) => note.id !== id));
      toast({
        title: "Note deleted",
        status: "info",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={5}>
      <Flex mb={5} justify="space-between">
        <Flex>
          <Input placeholder="Add a new note..." value={input} onChange={(e) => setInput(e.target.value)} onKeyPress={(e) => e.key === "Enter" && addNote()} />
          <Button ml={2} onClick={addNote} colorScheme="blue">
            <FaPlus />
          </Button>
        </Flex>
        <Select value={sortType} onChange={(e) => setSortType(e.target.value)}>
          <option value="time">Sort by Time</option>
          <option value="text">Sort by Text</option>
          <option value="manual">Manual</option>
        </Select>
      </Flex>
      <VStack spacing={4}>
        {notes.map((note) => (
          <Flex key={note.id} align="center" justify="space-between" p={3} w="100%" borderWidth="1px" borderRadius="lg">
            <Link to={`/note/${note.id}`}>
              <Text>{note.text}</Text>
            </Link>
            <Button onClick={() => deleteNote(note.id)} colorScheme="red">
              <FaTrash />
            </Button>
          </Flex>
        ))}
      </VStack>
    </Box>
  );
};

export default Index;
