@@ .. @@
 // Initialize monitoring
 export const initMonitoring = (): void => {
+  // Skip initialization in test environment
+  if (import.meta.env.MODE === 'test') {
+    return;
+  }
+
   // Set up global error handler
};