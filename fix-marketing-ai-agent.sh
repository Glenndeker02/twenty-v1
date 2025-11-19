#!/bin/bash

# Fix script for Marketing AI Agent Module
# This script fixes all critical ORM-related issues

set -e

BASE_DIR="/home/user/twenty-v1/packages/twenty-server/src/modules/marketing-ai-agent"

echo "🔧 Fixing Marketing AI Agent Module..."
echo ""

# Fix 1: Update all imports from TwentyORMManager to TwentyORMGlobalManager
echo "📝 Fixing imports..."
find "$BASE_DIR" -type f -name "*.ts" -exec sed -i 's/import { TwentyORMManager }/import { TwentyORMGlobalManager }/g' {} \;

# Fix 2: Update constructor parameters
echo "📝 Fixing constructor parameters..."
find "$BASE_DIR" -type f -name "*.ts" -exec sed -i 's/private readonly twentyORMManager: TwentyORMManager/private readonly twentyORMGlobalManager: TwentyORMGlobalManager/g' {} \;

# Fix 3: Update all method calls from twentyORMManager to twentyORMGlobalManager
echo "📝 Fixing method calls..."
find "$BASE_DIR" -type f -name "*.ts" -exec sed -i 's/this\.twentyORMManager\./this.twentyORMGlobalManager./g' {} \;

echo ""
echo "✅ Basic fixes applied!"
echo ""
echo "⚠️  MANUAL FIXES STILL REQUIRED:"
echo "   - Change all .getRepository() calls to .getRepositoryForWorkspace()"
echo "   - Add workspaceId parameter to all repository access"
echo "   - Update entity name strings to lowercase"
echo ""
echo "   Example:"
echo "   FROM: await this.twentyORMGlobalManager.getRepository<Entity>('entityName')"
echo "   TO:   await this.twentyORMGlobalManager.getRepositoryForWorkspace<Entity>(workspaceId, 'entityName')"
echo ""
