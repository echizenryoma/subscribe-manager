<template>
  <v-app>
    <v-container>
      <v-sheet border rounded>
        <v-data-table :headers="headers" :hide-default-footer="true" :items="templates">
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>
                <v-icon color="medium-emphasis" icon="mdi-book-multiple" size="x-small" start></v-icon>
                模板管理
              </v-toolbar-title>

              <v-btn class="me-2" prepend-icon="mdi-plus" rounded="lg" text="添加模板" border
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

      <!-- 添加/编辑模板的对话框 -->
      <v-dialog v-model="dialog" max-width="800" max-height="600">
        <v-card>
          <v-card-title>
            <span>{{ isEditing ? '编辑模板' : '添加模板' }}</span>
          </v-card-title>
          <v-card-text>
            <v-text-field v-model="currentTemplate.name" label="模板名称" :disabled="isEditing" />
            <v-select v-model="currentTemplate.encode" :items="encodeItems" label="编码方式"></v-select>
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
      currentTemplate: { name: '', content: '', encode: 'text' },
      currentIndex: -1,
      isEditing: false,
      encodeItems: ["text", "base64"],
      headers: [
        { title: '模板名称', key: 'name' },
        { title: '编码格式', key: 'encode' },
        { title: '操作', key: 'actions', align: 'end', sortable: false },
      ]
    };
  },
  mounted() {
    this.fetchTemplate();
  },
  methods: {
    openAddDialog() {
      this.currentTemplate = { name: '', content: '', encode: 'text' };
      this.isEditing = false;
      this.dialog = true;
    },
    openEditDialog(template) {
      this.currentTemplate = { ...template };
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
    confirmDelete(template) {
      this.currentTemplate = template;
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
