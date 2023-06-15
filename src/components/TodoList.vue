<template>
  <q-layout>
    <q-page-container>
      <q-page class="bg-grey-3 column" padding>
        <div class="row q-pa-sm bg-primary">
          <q-input v-model="newTodo" @keyup.enter="addTodo" class="col" square filled bg-color="white"
            placeholder="Ajouter une tâche" dense>
            <template v-slot:append>
              <q-btn @click="addTodo" round dense flat icon="add" />
            </template>
          </q-input>
        </div>
        <h5>À faire</h5>
        <div>({{ checkedTodoCount }} / {{ todos.length }})</div>

        <q-list class="bg-white" separator bordered>
          <q-item v-for="todo in todos" :key="todo.title" @click="todo.completed = !todo.completed"
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
      newTodo: '',
      checkedTodoCount: 0
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
          title: this.newTodo,
          description: '',
          dueDate: ''

          // Autres propriétés de la tâche...
        })
        console.log(response.data) // Réponse du serveur en cas de succès
      } catch (error) {
        console.error(error) // Gestion des erreurs
      }
      this.todos.push({
        title: this.newTodo
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
    }

  },

  async updateTodo (todoId, updatedTodo) {
    try {
      // Effectuez une requête PUT ou PATCH vers votre API pour mettre à jour la tâche
      await axios.put(`http://localhost:3000/todos/update/${todoId}`, updatedTodo)
      // Mettez à jour localement le tableau de tâches avec les nouvelles données de la tâche modifiée
      const todosIndex = this.todos.findIndex(todo => todo.id === todoId)
      if (todosIndex !== -1) {
        this.todos.splice(todosIndex, 1, updatedTodo)
      }
    } catch (error) {
      // Gérez les erreurs lors de la modification de la tâche
      console.error(error)
    }
  },

  toggleTodo (todo) {
    todo.checked = !todo.checked
    this.updateCheckedTodoCount()
  },
  updateCheckedTodoCount () {
    this.checkedTodoCount = this.todos.filter(todo => todo.checked).length
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
