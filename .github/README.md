# Node Healthcheck

![Node Hosting Project Logo](node-hosting.png)

## Introduction

This is a simple API that checks the health of a Vechain Node by comparing the timestamp of its latest block with the current time. If the timestamp is within an acceptable tolerance setting, it is considered healthy.

The main purpose of this tool is to be used in load balancers and availability monitors, to determine whether a node is not only online, but also fully synchronized with the blockchain.

The API contains two endpoints:

- /healthcheck

  used by ALB to determine whether the node is online

- /metrics

  used by Prometheus to collect metrics about last block timestamp, number of seconds since last block and node healtchcheck status.

Consider turning on branch protection for `main` as follows:
1. Require a pull request before merging.
  1. Require 1 approval.
  2. Dismiss stale pull request approvals when new commits are pushed.
  3. Require review from Code Owners.
  4. Require approval of the most recent reviewable push.
2. Require status checks to pass before merging.
3. Require branches to be up to date before merging.
4. Require conversation resolution before merging.
5. Require deployments to succeed before merging.

## Table of Contents

- [Node Healthcheck](#node-healthcheck)
  - [Introduction](#introduction)
  - [Table of Contents](#table-of-contents)
  - [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Configuration](#configuration)
    - [Usage](#usage)
      - [Run locally](#run-locally)
      - [Run in docker](#run-in-docker)
      - [Monitor docker logs](#monitor-docker-logs)
      - [Release new docker image](#release-new-docker-image)
    - [Documentation](#documentation)
    - [Contributing](#contributing)
    - [Roadmap](#roadmap)
    - [Changelog](#changelog)
    - [License](#license)
    - [Credits](#credits)

## Getting Started

### Prerequisites

List the required software, libraries, or tools needed to use or contribute to the project.

### Installation

Provide step-by-step instructions for installing the project, including any required dependencies.

```bash
# Example installation commands
```

### Configuration

Explain how to configure the project, if necessary.

### Usage

#### Run locally

```bash
npm install && npm start
```

#### Run in docker

```bash
npm run docker
```

#### Monitor docker logs

```bash
docker logs -f node-healthcheck
```

#### Release new docker image

If you haven't done so already, enable multi-architecture builds on your system:
> 1. Enable Docker BuildKit for multi-architecture builds by setting the environment variable in your shell profile
> `export DOCKER_BUILDKIT=1`
> 2. Create Docker BuildKit builder on your system
> `docker buildx create --use`

Run the following commands to build and push the image to ECR:
```bash
docker login -u <your_username>
docker buildx build --platform linux/amd64,linux/arm64/v8 -t public.ecr.aws/vechainfoundation/node-healthcheck:<version> --push .
docker buildx build --platform linux/amd64,linux/arm64/v8 -t public.ecr.aws/vechainfoundation/node-healthcheck:latest --push .
```

### Documentation

Link to any additional documentation or tutorials, either within your repository or hosted externally.

### Contributing

Explain how others can contribute to the project. Include information on:

    How to submit bug reports or feature requests.
    The process for submitting pull requests.
    Any specific coding standards or guidelines.
    The best way to get in touch with the maintainers, if needed.
    
You may use [a separate `CONTRIBUTING` file](/CONTRIBUTING.md) to keep your `README.md` short.

### Roadmap

Share the project's development roadmap, if available, including planned features and improvements.

### Changelog

Keep a log of all notable changes and updates in the project.

### License

This project is licensed under the LICENSE-NAME - see [the LICENSE file](/LICENSE.md) for details.

### Credits

Recognize any significant contributors, sponsors, or organizations that have supported the project.
