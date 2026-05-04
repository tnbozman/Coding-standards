# Fat DevContainer for .NET 10 + Vue 3 development
# Base: .NET 10 SDK on Debian Bookworm (slim)
FROM mcr.microsoft.com/dotnet/sdk:10.0-preview AS base

ARG NODE_VERSION=22
ARG USERNAME=vscode
ARG USER_UID=1000
ARG USER_GID=${USER_UID}

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    ca-certificates \
    gnupg \
    git \
    git-lfs \
    unzip \
    zip \
    jq \
    bash-completion \
    sudo \
    openssh-client \
    procps \
    lsb-release \
    && rm -rf /var/lib/apt/lists/*

# Install Node.js (LTS via NodeSource)
RUN curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash - \
    && apt-get install -y --no-install-recommends nodejs \
    && rm -rf /var/lib/apt/lists/*

# Install global Node tooling
RUN npm install -g \
    npm@latest \
    @vue/cli \
    vite \
    typescript \
    ts-node \
    eslint \
    prettier

# Install .NET global tools
RUN dotnet tool install --global dotnet-ef \
    && dotnet tool install --global dotnet-format \
    && dotnet tool install --global csharpier \
    && dotnet tool install --global dotnet-sonarscanner

# Add .NET tools to PATH
ENV PATH="${PATH}:/root/.dotnet/tools"

# Install Trivy (Docker / container security scanner)
RUN curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sh -s -- -b /usr/local/bin

# Install Hadolint (Dockerfile linter)
RUN HADOLINT_VERSION=$(curl -s https://api.github.com/repos/hadolint/hadolint/releases/latest | jq -r '.tag_name') \
    && curl -sSL "https://github.com/hadolint/hadolint/releases/download/${HADOLINT_VERSION}/hadolint-Linux-x86_64" \
       -o /usr/local/bin/hadolint \
    && chmod +x /usr/local/bin/hadolint

# Create non-root user
RUN groupadd --gid ${USER_GID} ${USERNAME} \
    && useradd --uid ${USER_UID} --gid ${USER_GID} -m ${USERNAME} \
    && echo "${USERNAME} ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers.d/${USERNAME} \
    && chmod 0440 /etc/sudoers.d/${USERNAME}

# Ensure .dotnet/tools path is available for the vscode user as well
RUN mkdir -p /home/${USERNAME}/.dotnet/tools \
    && chown -R ${USERNAME}:${USERNAME} /home/${USERNAME}/.dotnet

USER ${USERNAME}

# Install user-scoped .NET global tools
RUN dotnet tool install --global dotnet-ef \
    && dotnet tool install --global dotnet-format \
    && dotnet tool install --global csharpier

ENV PATH="${PATH}:/home/${USERNAME}/.dotnet/tools"

WORKDIR /workspace
