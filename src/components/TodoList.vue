<template>
  <q-layout>
    <q-page-container>
      <q-page class="bg-grey-3 column" padding>
        <div class="row q-pa-sm bg-primary">
          <q-input v-model="newTodo" :key="newTodo.id" @keyup.enter="addTodo" class="col" square filled bg-color="white"
            placeholder="Ajouter une tâche" dense>
            <template v-slot:append>
              <q-btn @click="addTodo" round dense flat icon="add" />
            </template>
          </q-input>
        </div>
        <h5>À faire</h5>
        <div>({{ checkedCount }} / {{ todos.length }})</div>

        <q-list class="bg-white" separator bordered>
          <q-item v-for="todo in todos" :key="todo.id"  @click="updateCompleted(todo)"
            :class="{ 'completed bg-grey-1': todo.completed }" clickable v-ripple>
            <q-item-section avatar>
              <q-checkbox v-model="todo.completed" class="no-pointer-events" color="primary" />
            </q-item-section>
            <q-item-section>
              <q-item-label>{{ todo.title }}</q-item-label>
            </q-item-section>
            <q-item-section v-if="todo.completed" side>
              <q-btn @click="deleteTodo(todo.id)" flat round dense color="primary" icon="delete" />
            </q-item-section>
          </q-item>
        </q-list>
        <div v-if="!todos.length" class="no-todos absolute-center">
          <q-icon name="check" size="100px" color="primary" />
          <div class="text-h5 text-primary text-center">
            Pas de tâches
          </div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>
<script>

import axios from 'axios'

export default {

  created () {
    this.fetchTodos()
  },

  data () {
    return {
      todos: [],
      newTodo: ''
    }
  },

  methods: {

    async fetchTodos () {
      axios.get('http://localhost:3000/todos')
        .then(response => {
          // Traitez les données de réponse
          const todos = response.data
          // Faites quelque chose avec les tâches récupérées, comme les stocker dans une variable de données
          this.todos = todos
        })
        .catch(error => {
          // Gérez les erreurs
          console.error(error)
        })
    },

    async addTodo () {
      try {
        const response = await axios.post('http://localhost:3000/todos', {
          title: this.newTodo
          // Autres propriétés de la tâche...
        })
        console.log(response.data) // Réponse du serveur en cas de succès
      } catch (error) {
        console.error(error) // Gestion des erreurs
      }
      this.todos.push({
        title: this.newTodo,
        completed: false
      })
    },

    async deleteTodo (todoId) {
      await axios.delete(`http://localhost:3000/todos/delete/${todoId}`)
        .then(response => {
          this.todos = this.todos.filter(todo => todo.id !== todoId)
        })
        .catch(error => {
          // Gestion des erreurs lors de la suppression
          console.error(error)
        })
    },

    async updateCompleted (todo) {
      // Inverser la valeur de la propriété completed
      todo.completed = !todo.completed

      try {
        // Envoyer une requête à votre serveur backend pour mettre à jour la tâche
        await axios.put(`http://localhost:3000/todos/update/${todo.id}`, { title: todo.title, completed: todo.completed })
      } catch (error) {
        console.error(error)
      }
    }
  },

  computed: {
    checkedCount () {
      return this.todos.filter(todo => todo.completed).length
    }
  }

}

</script>

<style scoped>
.completed {
  text-decoration: line-through;
}

  .no-tasks {
    opacity: 0.5;
  }
</style>
