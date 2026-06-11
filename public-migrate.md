# Нужно сделать папку ./content/obsidian-notes/public рутовой content/public/

Только есть подводные камни:

1. сейчас submodule Obsidian-Vault при синхронизации делает pull всех файлов с репозитория, а мне нужно точечно забирать изменения с папки Obsidian-Vault/public и заполнять ими папку ./content/public/.
2. Нужно переименовать папку public в obsidian-notes
