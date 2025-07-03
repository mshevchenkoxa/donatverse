FROM ubuntu:22.04

# Оновлюємо репозиторії та встановлюємо необхідні бібліотеки
RUN apt-get update && apt-get install -y \
    libc6 \
    libstdc++6 \
    curl \
    git \
    build-essential \
    && rm -rf /var/lib/apt/lists/*

# Встановлення Rust та Cargo
RUN curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
ENV PATH="/root/.cargo/bin:${PATH}"

# Встановлення Solana CLI (може бути не обов'язковим тут, якщо потрібно лише для тестів Anchor)
# RUN curl -sSfL https://release.solana.com/v1.17.0/install | sh
# ENV PATH="/root/.local/share/solana/install/active_release/bin:${PATH}"

# Встановлення Anchor CLI
RUN cargo install --locked anchor-cli --force

# Копіювання файлів проєкту
WORKDIR /project
COPY . .

# Встановлення залежностей Rust проєкту
RUN cargo build

# Команда за замовчуванням для запуску bash (для подальших команд)
CMD ["bash"]