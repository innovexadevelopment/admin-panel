#!/bin/bash
# Script to help replace alerts with toast notifications
# This is a helper - actual replacements are done manually to ensure correctness

echo "This script is a helper. Replace alerts manually in the following files:"
echo ""
grep -r "alert(" admin-panel/app/dashboard --include="*.tsx" -l

