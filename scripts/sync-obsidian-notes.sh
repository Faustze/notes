#!/bin/bash
# Синхронизация публичных заметок из Obsidian-Vault
# Копирует содержимое Obsidian-Vault/public в content/obsidian-notes/

set -euo pipefail

VAULT_REPO="https://github.com/Faustze/Obsidian-Notes.git"
TEMP_DIR=$(mktemp -d)
CONTENT_DIR="content/obsidian-notes"

echo "📥 Клонирую Obsidian-Vault..."
git clone --depth 1 "$VAULT_REPO" "$TEMP_DIR"

cd "$TEMP_DIR"

# Проверяем наличие папки public
if [ ! -d "public" ]; then
    echo "⚠️  Папка public/ не найдена в Obsidian-Vault"
    echo "    Создаю пустую папку public/ в репозитории Obsidian-Vault"
    echo "    Поместите туда заметки, которые хотите опубликовать"
    rm -rf "$TEMP_DIR"
    exit 0
fi

echo "📋 Копирую содержимое public/ в $CONTENT_DIR/..."

# Удаляем старый контент (кроме .gitkeep если есть)
cd -
rm -rf "$CONTENT_DIR"/*
mkdir -p "$CONTENT_DIR"

# Копируем содержимое public/ (без самой папки public)
cp -r "$TEMP_DIR"/public/* "$CONTENT_DIR"/ 2>/dev/null || true

# Удаляем временную директорию
rm -rf "$TEMP_DIR"

echo "✅ Синхронизация завершена!"
echo "   Не забудьте закоммитить изменения:"
echo "   git add $CONTENT_DIR/"
echo "   git commit -m 'sync: update obsidian notes'"
