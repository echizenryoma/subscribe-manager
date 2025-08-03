<template>
  <v-app>
    <v-container>
      <v-toolbar>
        <v-toolbar-title>账户管理</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="openAddDialog">添加账户</v-btn>
      </v-toolbar>

      <v-simple-table fixed-header>
        <template v-slot:default>
          <thead>
            <tr>
              <th class="px-2">UUID</th>
              <th class="px-2">账户名称</th>
              <th class="px-2">操作</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="(user, index) in users" :key="user.uuid">
              <td class="px-2">{{ user.uuid }}</td>
              <td class="px-2">{{ user.name }}</td>
              <td class="px-2">
                <v-btn icon size="small" density="compact" @click.stop="openEditDialog(user, index)">
                  <v-icon size="small">mdi-pencil</v-icon>
                </v-btn>
                <v-btn icon size="small" density="compact" @click.stop="confirmDelete(index)">
                  <v-icon size="small">mdi-delete</v-icon>
                </v-btn>
              </td>
            </tr>
          </tbody>
        </template>
      </v-simple-table>

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
                  <v-icon>mdi-refresh</v-icon>
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
      currentIndex: -1,
      isEditing: false,
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
    confirmDelete(index) {
      this.currentIndex = index;
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

<style>
.v-data-table {
  margin-top: 20px;
}
</style>
