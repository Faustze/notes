#!/bin/bash
# Скрипт обновления Quartz из upstream
# Использование: bash scripts/update-quartz.sh [--check]

set -euo pipefail

cd "$(dirname "$0")/.."

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${YELLOW}🔄 Обновление Quartz...${NC}"

CURRENT_BRANCH=$(git branch --show-current)
echo "📍 Текущая ветка: $CURRENT_BRANCH"

if [ "$CURRENT_BRANCH" != "main" ]; then
    echo -e "${RED}❌ Переключитесь в main перед обновлением${NC}"
    echo "   git checkout main"
    exit 1
fi

if ! git diff-index --quiet HEAD --; then
    echo -e "${RED}❌ Есть незакоммиченные изменения${NC}"
    echo "   Закоммитьте или спрячьте их перед обновлением"
    exit 1
fi

echo "📥 Получаю изменения из upstream/v5..."
git fetch upstream v5

LOCAL=$(git rev-parse main)
REMOTE=$(git rev-parse upstream/v5)
BASE=$(git merge-base main upstream/v5)

if [ "$LOCAL" = "$REMOTE" ]; then
    echo -e "${GREEN}✅ Quartz уже актуален${NC}"
    exit 0
fi

if [ "$BASE" = "$REMOTE" ]; then
    echo -e "${YELLOW}⚠️  Вы впереди upstream — обновление не требуется${NC}"
    exit 0
fi

echo ""
echo "📋 Новые коммиты в upstream/v5:"
git log --oneline main..upstream/v5 | head -20
echo ""

if [ "${1:-}" = "--check" ]; then
    echo -e "${YELLOW}ℹ️  Это был только проверочный запуск${NC}"
    echo "   Для обновления запустите без --check"
    exit 0
fi

echo "🔀 Мержу upstream/v5 в main..."
if git merge upstream/v5 --no-edit; then
    echo -e "${GREEN}✅ Успешно обновлено!${NC}"
    echo ""
    echo "📤 Пуш в origin..."
    git push origin main
    echo -e "${GREEN}✅ Готово! GitHub Actions автоматически задеплоит изменения${NC}"
else
    echo -e "${RED}❌ Конфликты при мерже!${NC}"
    echo ""
    echo "Решите конфликты и выполните:"
    echo "  git add ."
    echo "  git commit"
    echo "  git push origin main"
    exit 1
fi
