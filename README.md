# PHP Intelligence

Standalone PHPForge IDE plugin, extracted from the MIT-licensed implementation. Requires IDE 0.2.13, project.read, project.write and explicit workbench trust. Trusted UI code runs in the IDE window. No Node runtime is used.

The package owns local PHP types, import/alias navigation, method families, trait adaptation, completion imports, hierarchy gutters, semantic tokens, usage counts, inspections, quick fixes, rename/move previews and extract/inline refactorings. The language engine receives the host transport and shared PluginHost factory; external language workers remain shared rather than duplicated. Other languages are coordinated by the IDE.

The current transport still uses the host's Phpactor LSP service and secure workspace edit transaction broker. This frontend package does not claim to move that backend process implementation. Disabling unregisters providers, listeners, timers, decorations and dialogs. In-flight diagnostics cannot reappear after disable.

Build and test: npm ci --ignore-scripts; npm test; npm run build. Browser bundles are committed and CI verifies reproducibility. Tests include synthetic PHP fixture semantics and UI contribution lifecycle; host integration must validate actual Tauri windows separately.
