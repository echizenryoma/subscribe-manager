<template>
  <v-app>
    <v-container>
      <v-sheet border rounded>
        <v-data-table :headers="headers" :hide-default-footer="true" :items="users">
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>
                <v-icon color="medium-emphasis" icon="mdi-book-multiple" size="x-small" start></v-icon>
                账户管理
              </v-toolbar-title>

              <v-btn class="me-2" prepend-icon="mdi-plus" rounded="lg" text="添加账户" border
                @click="openAddDialog"></v-btn>
            </v-toolbar>
          </template>

          <template v-slot:item.actions="{ item }">
            <div class="d-flex ga-2 justify-end">
              <v-icon color="medium-emphasis" icon="mdi-pencil" size="small" @click="openEditDialog(item)"></v-icon>
              <v-icon color="medium-emphasis" icon="mdi-delete" size="small" @click="confirmDelete(item)"></v-icon>
            </div>
          </template>
        </v-data-table>
      </v-sheet>

      <!-- 添加/编辑账户的对话框 -->
      <v-dialog v-model="dialog" max-width="500">
        <v-card>
          <v-card-title>
            <span>{{ isEditing ? '编辑账户' : '添加账户' }}</span>
          </v-card-title>
          <v-card-text>
            <v-row align="center">
              <v-col cols="10">
                <v-text-field v-model="currentUser.uuid" label="UUID" :disabled="isEditing" />
              </v-col>
              <v-col cols="2">
                <v-btn icon @click="generateUUID" :disabled="isEditing">
                  <v-icon size="small">mdi-refresh</v-icon>
                </v-btn>
              </v-col>
            </v-row>
            <v-text-field v-model="currentUser.name" label="账户名称" />
          </v-card-text>
          <v-card-actions>
            <v-btn color="blue darken-1" text @click="closeDialog">取消</v-btn>
            <v-btn color="blue darken-1" text @click="saveUser">{{ isEditing ? '保存' : '添加' }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- 删除确认对话框 -->
      <v-dialog v-model="confirmDialog" max-width="290">
        <v-card>
          <v-card-title class="headline">确认删除</v-card-title>
          <v-card-text>你确定要删除这个账户吗？</v-card-text>
          <v-card-actions>
            <v-btn color="blue darken-1" text @click="confirmDialog = false">取消</v-btn>
            <v-btn color="blue darken-1" text @click="deleteUser">确认</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      users: [],
      dialog: false,
      confirmDialog: false,
      currentUser: { uuid: '', name: '' },
      isEditing: false,
      headers: [
        { title: 'UUID', key: 'uuid' },
        { title: '账户名称', key: 'name' },
        { title: '操作', key: 'actions', align: 'end', sortable: false },
      ]
    };
  },
  mounted() {
    this.fetchUser();
  },
  methods: {
    openAddDialog() {
      this.currentUser = { uuid: '', name: '' };
      this.isEditing = false;
      this.dialog = true;
    },
    openEditDialog(template, index) {
      this.currentUser = { ...template };
      this.currentIndex = index;
      this.isEditing = true;
      this.dialog = true;
    },
    closeDialog() {
      this.dialog = false;
    },
    async fetchUser() {
      const response = await fetch('/api/users');
      this.users = await response.json();
    },
    async saveUser() {
      if (this.isEditing) {
        await fetch(`/api/users/${this.currentUser.name}`, {
          method: 'PUT',
          headers: { 'name-type': 'application/json' },
          body: JSON.stringify(this.currentUser)
        })
      } else {
        await fetch('/api/users', {
          method: 'POST',
          headers: { 'name-type': 'application/json' },
          body: JSON.stringify(this.currentUser)
        })
      }
      this.closeDialog();
      await this.fetchUser();
    },
    confirmDelete(user) {
      this.currentUser = user;
      this.confirmDialog = true;
    },
    async deleteUser() {
      await fetch(`/api/users/${this.currentUser.uuid}`, {
        method: 'DELETE',
      })
      await this.fetchUser();
      this.confirmDialog = false;
    },
    generateUUID() {
      this.currentUser.uuid = crypto.randomUUID();
    },
  }
};
</script>
