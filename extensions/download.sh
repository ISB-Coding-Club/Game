#!/bin/bash

set -e

wget -qO vsliveshare.vsix --show-progress "$(cat vsliveshare.vsix.meta)"

wget -qO vsliveshare-audio.vsix --show-progress "$(cat vsliveshare-audio.vsix.meta)"

wget -qO vsliveshare-pack.vsix --show-progress "$(cat vsliveshare-pack.vsix.meta)"
