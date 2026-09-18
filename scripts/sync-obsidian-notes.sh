#!/bin/bash
# Синхронизация публичных заметок из Obsidian-Vault
# Копирует содержимое Obsidian-Vault/public в content/

set -euo pipefail

VAULT_URL="https://github.com/Faustze/Obsidian-Notes.git"
TEMP_DIR=$(mktemp -d)
CONTENT_DIR="content"

# Временная директория удаляется при любом выходе, в том числе при ошибке
trap 'rm -rf "$TEMP_DIR"' EXIT

# Используем OBSIDIAN_VAULT_TOKEN для аутентификации в CI.
# Токен передаётся через GIT_CONFIG_* (env), а не в URL: так он не попадает
# ни в аргументы процесса, ни в .git/config клона, ни в сообщения об ошибках.
if [ -n "${OBSIDIAN_VAULT_TOKEN:-}" ]; then
    AUTH=$(printf 'x-access-token:%s' "$OBSIDIAN_VAULT_TOKEN" | base64 -w0)
    if [ -n "${GITHUB_ACTIONS:-}" ]; then
        echo "::add-mask::$AUTH"
    fi
    export GIT_CONFIG_COUNT=1
    export GIT_CONFIG_KEY_0="http.https://github.com/.extraheader"
    export GIT_CONFIG_VALUE_0="AUTHORIZATION: basic $AUTH"
fi

echo "📥 Клонирую Obsidian-Vault..."
if ! git clone --depth 1 "$VAULT_URL" "$TEMP_DIR"; then
    echo "❌ Не удалось склонировать Obsidian-Vault."
    if [ -n "${OBSIDIAN_VAULT_TOKEN:-}" ]; then
        echo "   Скорее всего OBSIDIAN_VAULT_TOKEN истёк или отозван."
        echo "   Создайте новый fine-grained PAT (Contents: Read-only для Faustze/Obsidian-Notes)"
        echo "   и обновите секрет: gh secret set OBSIDIAN_VAULT_TOKEN -R Faustze/notes"
    fi
    exit 1
fi
unset GIT_CONFIG_COUNT GIT_CONFIG_KEY_0 GIT_CONFIG_VALUE_0

# Проверяем наличие папки public
if [ ! -d "$TEMP_DIR/public" ]; then
    echo "⚠️  Папка public/ не найдена в Obsidian-Vault"
    echo "    Создайте папку public/ в репозитории Obsidian-Vault"
    echo "    Поместите туда заметки, которые хотите опубликовать"
    exit 0
fi

# Удаляем симлинки: иначе ссылка вида public/x -> /etc/passwd или на приватную
# часть vault была бы скопирована и опубликована на сайте.
find "$TEMP_DIR/public" -type l -print -delete | sed 's/^/   пропускаю симлинк: /'

echo "📋 Копирую содержимое public/ в $CONTENT_DIR/..."

mkdir -p "$CONTENT_DIR"

# Если внутри public/ есть только папка obsidian-notes, копируем её содержимое напрямую
if [ -d "$TEMP_DIR/public/obsidian-notes" ] && [ ! -d "$TEMP_DIR/public/hh" ]; then
    echo "   Найдена папка obsidian-notes/, копирую содержимое напрямую..."
    cp -r "$TEMP_DIR"/public/obsidian-notes/* "$CONTENT_DIR"/ 2>/dev/null || true
else
    # Копируем всё содержимое public/ (без самой папки public)
    cp -r "$TEMP_DIR"/public/* "$CONTENT_DIR"/ 2>/dev/null || true
fi

echo "✅ Синхронизация завершена!"
echo "   Не забудьте закоммитить изменения:"
echo "   git add $CONTENT_DIR/"
echo "   git commit -m 'sync: update vault notes'"
