<template>
  <v-app>
    <v-container>
      <v-toolbar>
        <v-toolbar-title>模板管理</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="openAddDialog">添加模板</v-btn>
      </v-toolbar>

      <v-list>
        <v-list-item-group>
          <v-list-item v-for="(template, index) in templates" :key="index">
            <v-list-item-content>
              <div>
                <strong>{{ template.name }}</strong>
              </div>
            </v-list-item-content>
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

      <!-- 添加/编辑模板的对话框 -->
      <v-dialog v-model="dialog" max-width="800" max-height="600">
        <v-card>
          <v-card-title>
            <span>{{ isEditing ? '编辑模板' : '添加模板' }}</span>
          </v-card-title>
          <v-card-text>
            <v-text-field v-model="currentTemplate.name" label="模板名称" />
            <v-textarea v-model="currentTemplate.content" label="模板内容" rows="10" />
          </v-card-text>
          <v-card-actions>
            <v-btn color="blue darken-1" text @click="closeDialog">取消</v-btn>
            <v-btn color="blue darken-1" text @click="saveTemplate">{{ isEditing ? '保存' : '添加' }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>

      <!-- 删除确认对话框 -->
      <v-dialog v-model="confirmDialog" max-width="290">
        <v-card>
          <v-card-title class="headline">确认删除</v-card-title>
          <v-card-text>你确定要删除这个模板吗？</v-card-text>
          <v-card-actions>
            <v-btn color="blue darken-1" text @click="confirmDialog = false">取消</v-btn>
            <v-btn color="blue darken-1" text @click="deleteTemplate">确认</v-btn>
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
      templates: [],
      dialog: false,
      confirmDialog: false,
      currentTemplate: { name: '', content: '' },
      currentIndex: -1,
      isEditing: false,
    };
  },
  mounted() {
    this.fetchTemplate();
  },
  methods: {
    openAddDialog() {
      this.currentTemplate = { name: '', content: '' };
      this.isEditing = false;
      this.dialog = true;
    },
    openEditDialog(template, index) {
      this.currentTemplate = { ...template };
      this.currentIndex = index;
      this.isEditing = true;
      this.dialog = true;
    },
    closeDialog() {
      this.dialog = false;
    },
    async fetchTemplate() {
      const response = await fetch('/api/templates');
      this.templates = await response.json();
    },
    async saveTemplate() {
      if (this.isEditing) {
        await fetch(`/api/templates/${this.currentTemplate.name}`, {
          method: 'PUT',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(this.currentTemplate)
        })
      } else {
        await fetch('/api/templates', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(this.currentTemplate)
        })
      }
      this.closeDialog();
      await this.fetchTemplate();
    },
    confirmDelete(index) {
      this.currentIndex = index;
      this.confirmDialog = true;
    },
    async deleteTemplate() {
      await fetch(`/api/templates/${this.currentTemplate.name}`, {
        method: 'DELETE',
      })
      await this.fetchTemplate();
      this.confirmDialog = false;
    },
  },
};
</script>

<style>
.v-list-item {
  display: flex;
  justify-content: space-between;
}
</style>
