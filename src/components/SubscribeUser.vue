<template>
  <v-app>
    <v-container>
      <v-toolbar>
        <v-toolbar-title>账户管理</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="openAddDialog">添加账户</v-btn>
      </v-toolbar>

      <v-list>
        <v-list-item-group>
          <v-list-item v-for="(template, index) in users" :key="index">
            <v-list-item-name>
              <div>
                <strong>{{ template.uuid }}</strong>
                <strong>{{ template.name }}</strong>
              </div>
            </v-list-item-name>
            <v-list-item-action>
              <v-btn icon @click.stop="openEditDialog(template, index)">
                <v-icon>mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon @click.stop="confirmDelete(index)">
                <v-icon>mdi-delete</v-icon>
              </v-btn>
            </v-list-item-action>
          </v-list-item>
        </v-list-item-group>
      </v-list>

      <!-- 添加/编辑账户的对话框 -->
      <v-dialog v-model="dialog" max-width="500">
        <v-card>
          <v-card-title>
            <span>{{ isEditing ? '编辑账户' : '添加账户' }}</span>
          </v-card-title>
          <v-card-text>
            <v-text-field v-model="currentUser.uuid" label="UUID" />
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
      currentUser: { name: '', name: '' },
      currentIndex: -1,
      isEditing: false,
    };
  },
  mounted() {
    this.fetchUser();
  },
  methods: {
    openAddDialog() {
      this.currentUser = { name: '', name: '' };
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
      await fetch(`/api/users/${this.currentUser.name}`, {
        method: 'DELETE',
      })
      await this.fetchUser();
      this.confirmDialog = false;
    },
  },
};
</script>

<style>
.v-list-item {
  display: flex;
  justify-name: space-between;
}
</style>
