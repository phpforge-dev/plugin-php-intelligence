# PHP Intelligence

Standalone PHPForge IDE plugin, extracted from the MIT-licensed implementation. Requires IDE 0.2.13, project.read, project.write, process and explicit workbench trust. Trusted UI code runs in the IDE window. No Node runtime is used.

The package owns local PHP types, import/alias navigation, method families, trait adaptation, completion imports, hierarchy gutters, semantic tokens, usage counts, inspections, quick fixes, rename/move previews and extract/inline refactorings. The language engine receives the host transport and shared PluginHost factory; external language workers remain shared rather than duplicated. Other languages are coordinated by the IDE.

The native/ Rust library owns Phpactor LSP startup, RPC, diagnostics, synthetic probes, read-only PHAR stub extraction and safe refactoring transactions. The host compiles the pinned library and injects its local-history snapshot sink; it retains workspace authorization and routes requests only while the plugin is enabled and consented. This compiled library is not a dynamically unloaded native executable. Disabling unregisters providers, listeners, timers, decorations and dialogs. In-flight diagnostics cannot reappear after disable.

Build and test: npm ci --ignore-scripts; npm test; npm run build. Browser bundles are committed and CI verifies reproducibility. Tests include synthetic PHP fixture semantics and UI contribution lifecycle; host integration must validate actual Tauri windows separately.

Native validation: `cargo test --manifest-path native/Cargo.toml`. The host adapter implements SnapshotHistory and delegates snapshots to the IDE local history; package tests use a synthetic sink to check rollback, etag conflicts and history capture.
