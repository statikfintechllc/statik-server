# Visual Studio Code Kubernetes Tools

![Kubernetes Extension for Visual Studio Code logo](https://github.com/vscode-kubernetes-tools/vscode-kubernetes-tools/raw/HEAD/images/k8s-ext-logo/kefvsc-horizontal-colour.png)

[![OpenSSF Best Practices](https://www.bestpractices.dev/projects/10056/badge)](https://www.bestpractices.dev/projects/10056)
[![CodeQL Advanced](https://github.com/vscode-kubernetes-tools/vscode-kubernetes-tools/actions/workflows/codeql.yml/badge.svg)](https://github.com/vscode-kubernetes-tools/vscode-kubernetes-tools/actions/workflows/codeql.yml)
[![Development build](https://github.com/vscode-kubernetes-tools/vscode-kubernetes-tools/actions/workflows/build-dev.yml/badge.svg)](https://github.com/vscode-kubernetes-tools/vscode-kubernetes-tools/actions/workflows/build-dev.yml)

The extension for developers building applications to run in Kubernetes clusters
and for DevOps staff troubleshooting Kubernetes applications.

Works with any Kubernetes anywhere (Azure, Minikube, AWS, GCP and more!).

Features include:

* View your clusters in an explorer tree view, and drill into workloads, services,
  pods and nodes.
* Browse Helm repos and install charts into your Kubernetes cluster.
* Intellisense for Kubernetes resources and Helm charts and templates.
* Edit Kubernetes resource manifests and apply them to your cluster.
* Build and run containers in your cluster from Dockerfiles in your project.
* View diffs of a resource's current state against the resource manifest in your
  Git repo
* Easily check out the Git commit corresponding to a deployed application.
* Run commands or start a shell within your application's pods.
* Get or follow logs and events from your clusters.
* Forward local ports to your application's pods.
* Create Helm charts using scaffolding and snippets.
* Watch resources in the cluster explorer and get live updates as they change

**What's new in this version?**  See the [change log](https://github.com/vscode-kubernetes-tools/vscode-kubernetes-tools/blob/HEAD/CHANGELOG.md) to find out!

## Getting started with the extension

### Install

[Open this extension in the Visual Studio Marketplace](https://marketplace.visualstudio.com/items?itemName=ms-kubernetes-tools.vscode-kubernetes-tools)

### Dependencies

The Kubernetes extension may need to invoke the following command line tools, depending on
which features you use.  You will need `kubectl` at minimum, and `docker` or `buildah` if you plan to
use the extension to build applications rather than only browse.

* `kubectl`
* `docker` or `buildah`
* `helm`

Optional tools:
* `az` (Azure CLI - only if using the extension to create or register Azure clusters)
* `minikube` (only if you want to use it)
* `git` (only if using the 'sync working copy to repository' feature)
* `buildah` (can be used as an alternative container image build tool)

We recommend you install these binaries on your system PATH before using the extension.
If these binaries aren't on your system PATH, then some commands may not work. If the
extension needs one of the core Kubernetes tools and it's missing, it will offer to
install it for you.

### Configuration settings for building and running applications

If you want to use the `Kubernetes: Run` and `Kubernetes: Debug` features
then you need to configure a user and repository for your container
images. This is required because these commands need pushing an image of your application
for your cluster to run it. To do this, add the following to your VS Code preferences
(File > Preferences):

```javascript
{
  "vsdocker.imageUser": "<your-image-prefix-here>",
}
```

where `<your-image-prefix-here>` is something like `docker.io/brendanburns`.

**That's it!  You're good to go.**

## Working with kubeconfigs

By default, the extension uses the active kubeconfig file -- that is, the file
to which the KUBECONFIG environment variable points, or the default kubeconfig
if no KUBECONFIG environment variable exists. You can override this using the
`vs-kubernetes.kubeconfig` setting in your user or workspace settings.

If you want to swap between multiple kubeconfig files, you can list them in the
`vs-kubernetes.knownKubeconfigs` configuration setting and switch between them
using the `Set Kubeconfig` command.

If you want to skip TLS verification for a particular cluster, you can edit your ~/.kube/config and set the ```insecure-skip-tls-verify: true``` flag under the proper cluster:
```
- cluster:
    insecure-skip-tls-verify: true
    server: https://my-insecure-cluster:443
    name: my-insecure-cluster:443
```

## Commands and features

`vs-kubernetes-tools` supports a number of commands for interacting with Kubernetes; these are accessible via the command menu (`Ctrl+Shift+P`) and may be bound to keys in the normal way.

### Kubernetes

#### General commands

   * `Kubernetes: Load` - Load a resource from the Kubernetes API and create a new editor window.
   * `Kubernetes: Get` - Get the status for a specific resource.
   * `Kubernetes: Logs` - Open a view with a set of options to display/follow logs.
   * `Kubernetes: Follow Events` - Follow events on a selected namespace.
   * `Kubernetes: Show Events` - Show events on a selected namespace.
   * `Kubernetes: Watch` - Watch a specific resource or all resources of that object type, and update the cluster explorer as they change
   * `Kubernetes: Stop Watching` - Stop watching the specific resource

#### Commands while viewing a Kubernetes manifest file

   * `Kubernetes: Explain` - Use the `kubectl explain ...` tool to annotate Kubernetes API objects
   * `Kubernetes: Create` - Create an object using the current document
   * `Kubernetes: Delete` - Delete an object contained in the current document.
   * `Kubernetes: Apply` - Apply changes to an object contained in the current document.
   * `Kubernetes: Expose` - Expose the object in the current document as a service.
   * `Kubernetes: Describe` - Describe the object in a terminal window.
   * `Kubernetes: Diff` - Show the difference between a local copy of the object, and that which is deployed to the cluster.

#### Commands for application directories

   * `Kubernetes: Run` - Run the current application as a Kubernetes Deployment
   * `Kubernetes: Terminal` - Open an interactive terminal session in a pod of the Kubernetes Deployment
   * `Kubernetes: Exec` - Run a command in a pod of the Kubernetes Deployment
   * `Kubernetes: Debug (Launch)` - Run the current application as a Kubernetes Deployment and attach a debugging session to it (currently works only for Java/Node.js deployments). See [Debug support on Kubernetes cluster](https://github.com/Azure/vscode-kubernetes-tools/blob/master/debug-on-kubernetes.md) for more details.
   * `Kubernetes: Debug (Attach)` - Attach a debugging session to an existing Kubernetes Deployment (currently works only for Java deployments). See [Debug support on Kubernetes cluster](https://github.com/Azure/vscode-kubernetes-tools/blob/master/debug-on-kubernetes.md) for more details.
   * `Kubernetes: Remove Debug` - Remove the deployment and/or service created for a `Kubernetes Debug (Launch)` session
   * `Kubernetes: Sync Working Copy to Cluster` - Checks out the version of the code that matches what is deployed in the cluster.  (This relies on Docker image versions also being Git commit IDs, which the extension does if you use the Run command to build the container, but which typically doesn't work for containers/deployments done by other means.)

#### Cluster creation commands

   * `Kubernetes: Create Cluster` - Initiate the flow for creating a Kubernetes cluster with a selected cloud provider (eg: Azure), or creating a Minikube cluster locally.

#### Configuration commands

   * `Kubernetes: Add Existing Cluster` - Install and configure the Kubernetes command line tool (kubectl) from a cloud cluster, such as an Azure Container Service (ACS) or Azure Kubernetes Service (AKS) cluster
   * `Kubernetes: Set as Current Cluster` - Select from a list of configured clusters to set the "current" cluster. Used for searching, displaying, and deploying Kubernetes resources.
   * `Kubernetes: Delete Context` - Remove a cluster's configuration from the kubeconfig file.
   * `Kubernetes: Set Kubeconfig` - Select from a list of known kubeconfig files (for users who keep different kubeconfig files for different environments).
   * `Kubernetes: Show Cluster Info` - For a cluster, show the status of Kubernetes Components (API Server, etcd, KubeDNS, etc.) in a terminal window.
   * `Kubernetes: Use Namespace` - Select from a list of namespaces to set the "current" namespace. Used for searching, displaying, and deploying Kubernetes resources.

#### ConfigMap and Secret commands

   * `Kubernetes: Add File` - Adds a file as a ConfigMap or a Secret
   * `Kubernetes: Delete File` - Deletes a file from a ConfigMap or a Secret

#### Miscellaneous commands

   * `Kubernetes: Open Dashboard` - Opens the Kubernetes Dashboard in your browser.
   * `Kubernetes: Port Forward` - Prompts user for a local port and a remote port to bind to on a Pod.
   * `Kubernetes: Select Pod` - It allows to select a pod from a list of pods belonging to the "current" namespace. It can be invoked through command substitution `${command:extension.vsKubernetesSelectPod}`. See [Commands for debugging](https://github.com/Azure/vscode-kubernetes-tools/blob/master/debug-on-kubernetes.md#2-commands-for-debugging) for more details.

### Minikube

[Minikube](https://github.com/kubernetes/minikube) runs a local, single node Kubernetes cluster inside a VM. Support is currently experimental, and requires
Minikube tools to be installed and available on your PATH.

   * `Kubernetes: Start minikube` - Starts Minikube
   * `Kubernetes: Stop minikube` - Stops Minikube

### Helm

[Helm](https://helm.sh/) is the package manager for Kubernetes and provides a way for you to define, install and upgrade applications using 'charts.'  This extension provides a set of tools for creating and testing Helm charts:

   * Syntax highlighting for YAML + Helm Templates
   * Autocomplete for Helm, Sprig, and Go Tpl functions
   * Help text (on hover) for Helm, Sprig, and Go Tpl functions
   * Snippets for quickly scaffolding new charts and templates
   * Commands for...
     * `Helm: Create Chart` - Create a new chart
     * `Helm: Get Release` - Get a helm release from the cluster
     * `Helm: Lint` - Lint your chart
     * `Helm: Preview Template` - Open a preview window and preview how your template will render
     * `Helm: Template` - Run your chart through the template engine
     * `Helm: Dry Run` - Run a helm install --dry-run --debug on a remote cluster and get the results (NOTE: requires Tiller on the remote cluster)
     * `Helm: Version` - Get the Helm version
     * `Helm: Insert Dependency` - Insert a dependency YAML fragment
     * `Helm: Dependency Update` - Update a chart's dependencies
     * `Helm: Package` - Package a chart directory into a chart archive
     * `Helm: Convert to Template` - Create a template based on an existing resource or manifest
     * `Helm: Convert to Template Parameter` - Convert a fixed value in a template to a parameter in the `values.yaml` file
   * Code lenses for:
     * requirements.yaml (Add and update dependencies)
   * Right-click on a chart .tgz file, and choose inspect chart to preview all configurable chart values.

## Extension Settings

  The Kubernetes extension enables variable substitution for settings that require a path as a value. Variable substitution can be done using the `${variableName}` syntax. You can find a list of the variables supported in the [variables-reference](https://code.visualstudio.com/docs/editor/variables-reference) documentation.

   * `vs-kubernetes` - Parent for Kubernetes-related extension settings
       * `vs-kubernetes.namespace` - The namespace to use for all commands
       * `vs-kubernetes.kubectl-path` (*deprecated*) - File path to the kubectl binary. Note this is the binary file itself, not just the directory containing the file. On Windows, this must contain the `.exe` extension. This is deprecated, please use `vscode-kubernetes.kubectl-path` instead.
       * `vs-kubernetes.helm-path` (*deprecated*) - File path to the helm binary. Note this is the binary file itself, not just the directory containing the file. On Windows, this must contain the `.exe` extension. This is deprecated, please use `vscode-kubernetes.helm-path` instead.
       * `vs-kubernetes.minikube-path` (*deprecated*) - File path to the minikube binary. Note this is the binary file itself, not just the directory containing the file. On Windows, this must contain the `.exe` extension. This is deprecated, please use `vscode-kubernetes.minikube-path` instead.
       * `vs-kubernetes.kubectlVersioning` - By default, the extension uses the `kubectl` binary you provide on the system PATH or in the `vs-kubernetes.kubectl-path` configuration setting. If you set this setting to `infer`, then for each cluster the extension will attempt to identify the cluster version and download a compatible `kubectl` binary.  This improves compatibility if you have multiple Kubernetes versions in play, but may be slower.  **Note:** this setting is checked only when the extension loads; if you change it, you must reload the extension.
       * `vs-kubernetes.kubeconfig` - File path to the kubeconfig file you want to use. This overrides both the default kubeconfig and the KUBECONFIG environment variable.
       * `vs-kubernetes.knownKubeconfigs` - An array of file paths of kubeconfig files that you want to be able to quickly switch between using the Set Kubeconfig command.
       * `vs-kubernetes.autoCleanupOnDebugTerminate` - The flag to control whether to auto cleanup the created deployment and associated pod by the command "Kubernetes: Debug (Launch)". The cleanup action occurs when it failed to start debug session or debug session terminated. If not specified, the extension will prompt for whether to clean up or not. You might choose not to clean up if you wanted to view pod logs, etc.
       * `vs-kubernetes.outputFormat` - The output format that you prefer to view Kubernetes manifests in. One of "yaml" or "json". Defaults to "yaml".
       * `vs-kubernetes.resources-to-watch` - List of resources to be watched. To identify a resource the extension uses the label displayed in the cluster explorer. E.g. ["Pods", "Services", "Namespaces"].
       * `vscode-kubernetes.enable-snap-flag` - Enables compatibility with instances of VS Code that were installed using snap.
       * `vs-kubernetes.disable-context-info-status-bar` - Disable displaying your current Kubernetes context in VS Code's status bar. When active, it can be used to switch context from the status bar.
       * `vs-kubernetes.disable-namespace-info-status-bar` - Disable displaying your current Kubernetes namespace in VS Code's status bar. When active, it can be used to switch namespace from the status bar.
       * `vs-kubernetes.suppress-kubectl-not-found-alerts` - Turns off the warning (and installation prompt) if `kubectl` was not found. You should not normally set this, as most of the extension depends on `kubectl`, but it can be useful if working primarily with Helm.
       * `vs-kubernetes.suppress-helm-not-found-alerts` - Turns off the warning (and installation prompt) if `helm` was not found.
       * `vs-kubernetes.ignore-recommendations` - Set to true to silence Kubernetes extension recommendation notifications.
       * `vs-kubernetes.minikube-show-information-expiration` - Set to valid expiration date for minikube install to show information dialog box to display.
       * `vs-kubernetes.enable-minimal-workflow` - Enables the minimal workflow for several actions (Get, Describe, Scale, Expose, Switch). By executing one of those commands the queries to the cluster are reduced at minimum and users are able to freely type the resource name to use.
   * `vsdocker.imageUser` - Image prefix for the container images e.g. 'docker.io/brendanburns'
   * `checkForMinikubeUpgrade` - On extension startup, notify if a minikube upgrade is available. Defaults to true.
   * `disable-lint` - Disable all linting of Kubernetes files
   * `disable-linters` - Disable specific linters by name
   * `vscode-kubernetes.kubectl-path` - File path to the kubectl binary. Note this is the binary file itself, not just the directory containing the file. On Windows, this must contain the `.exe` extension.
   * `vscode-kubernetes.helm-path` - File path to the helm binary. Note this is the binary file itself, not just the directory containing the file. On Windows, this must contain the `.exe` extension.
   * `vscode-kubernetes.minikube-path` - File path to the minikube binary. Note this is the binary file itself, not just the directory containing the file. On Windows, this must contain the `.exe` extension.
   * `vscode-kubernetes.log-viewer.follow` - Set to true to follow logs by default in the log viewer.
   * `vscode-kubernetes.log-viewer.timestamp` - Set to true to show timestamps by default in the log viewer.
   * `vscode-kubernetes.log-viewer.since` - How far back to fetch logs from in seconds by default. Set to -1 for all logs.
   * `vscode-kubernetes.log-viewer.tail` - The number of recent logs to display by default in the log viewer. Set to -1 for all log lines.
   * `vscode-kubernetes.log-viewer.destination` - Where to display logs, defaults to the dedicated Webview.
   * `vscode-kubernetes.log-viewer.wrap` - Set to true to wrap lines by default in the log viewer.
   * `vscode-kubernetes.log-viewer.autorun` - Set to true to automatically begin fetching logs once the log viewer is opened using the default settings.

## Custom tool locations

For `kubectl` and `helm`, the binaries do not need to be on the system PATH. You can configure the extension by specifying the locations using the appropriate `vscode-kubernetes.${tool}-path` configuration setting.  See [Extension Settings](#extension-settings) below.

The extension can install `kubectl` and `helm` for you if they are missing - choose **Install dependencies** when you see an error notification for the missing tool.  This will set `kubectl-path` and `helm-path` entries in your configuration for the current OS (see "Portable extension configuration" below) - the programs will *not* be installed on the system PATH, but this will be sufficient for them to work with the extension.

If you are working with Azure Container Services or Azure Kubernetes Services, then you can install and configure `kubectl` using the `Kubernetes: Add Existing Cluster` command.

### Portable extension configuration

If you move your configuration file between machines with different OSes (and therefore different paths to binaries) you can override the following settings on a per-OS basis by appending `.windows`, `.mac` or `.linux` to the setting name:

  * `vscode-kubernetes.kubectl-path`
  * `vscode-kubernetes.helm-path`
  * `vscode-kubernetes.minikube-path`

For example, consider the following settings file:

```json
{
  "vscode-kubernetes.kubectl-path": "/home/foo/kubernetes/bin/kubectl",
  "vscode-kubernetes.kubectl-path-windows": "c:\\Users\\foo\\kubernetes\\bin\\kubectl.exe"
}
```

The first path would be used when invoking `kubectl` on Mac or Linux machines.  The second would be used when invoking `kubectl` on Windows machines.

## Keybinding support

The following commands support arguments in keybindings:

  * **Set Kubeconfig** (command ID `extension.vsKubernetesUseKubeconfig`) - the keybinding can specify a string argument which is the kubeconfig file path to switch to.  This allows you to set up specific keybindings for your favourite kubeconfigs.

## Linters
The extension supports linting Kubernetes YAML files for potential problems or suggestions.
Here are the various linters, you can enable or disable them individually using the `disable-linters` configuration value.
  * `resource-limits`: Warn when a Pod is missing resource limits

```json
{
  "vs-kubernetes": {
    "disable-linters": [
      "resource-limits"
    ]
  }
}
```

## YAML processing directives

You can customise how the extension processes a YAML file by putting a comment of the form
`# vscode-kubernetes-tools: ...directive(s)...` at the top of the file. The comment must appear before
any YAML elements (this saves us having to scan the whole of YAML files that could easily
be tens of thousands of lines!). Other comments and blank lines are okay.

The following directives are supported:

* `exclude`: Do not treat this file as a Kubernetes manifest. This is useful when you have
  files that look a lot like Kubernetes manifests but aren't, such as Kustomize patch files.

## Extension data

This extension stores its associated files and data in `$XDG_STATE_HOME/vs-kubernetes` (at `~/.local/state/vs-kubernetes` by default). However, if the legacy directory of `~/.vs-kubernetes` still exists, then that will be used instead.

## Known issues

  * `Kubernetes: Debug` command currently works only with Go, Node.js, Java, Python and .NET applications
  * For deeply nested Helm charts, template previews are generated against highest (umbrella) chart values (though for `Helm: Template` calls you can pick your chart)
  * When installing VS Code and/or kubectl through `snap` on a Linux system, you may face some permissions error which will prevent this extension to work correctly. As a workaround you can set up the `vs-kubernetes.enable-snap-flag` setting to `true` in your user or workspace settings.

## Release notes

See the [change log](https://github.com/vscode-kubernetes-tools/vscode-kubernetes-tools/blob/HEAD/CHANGELOG.md).

## Telemetry

This extension collects telemetry data to help us build a better experience for building applications with Kubernetes and VS Code. We only collect the following data:

* Which commands are executed, and whether they are executed against an Azure, Minikube or other type of cluster.
* For the `Create Cluster` and `Add Existing Cluster` commands, the cluster type selected and the execution result (success/failure).

We do not collect any information about image names, paths, etc. We collect cluster type information only if the cluster is Azure or a local cluster such as Minikube. The extension respects the `telemetry.enableTelemetry` setting which you can learn more about in our [FAQ](https://code.visualstudio.com/docs/supporting/faq#_how-to-disable-telemetry-reporting).

## Running from source

If you are building and running the extension from source, see [CONTRIBUTING.md](https://github.com/vscode-kubernetes-tools/vscode-kubernetes-tools/blob/HEAD/CONTRIBUTING.md) for prerequisites for the development environment.

## Installing from VSIX

If you are installing the extension from its VSIX, note that the machine will still need to reach the Visual Studio Marketplace in order to download extension dependencies.  If the machine cannot reach the Marketplace, you will need to install these dependencies manually using their VSIXes.  The list of extension dependencies can be found in `package.json`, in the `extensionDependencies` section.

## GitHub Pages Website

This project has a simple landing page website (visible at [vscode-kubernetes-tools.github.io/vscode-kubernetes-tools](https://vscode-kubernetes-tools.github.io/vscode-kubernetes-tools/)) which is [detailed here](https://github.com/vscode-kubernetes-tools/vscode-kubernetes-tools/tree/master/site).

## Contributing

This project welcomes contributions and suggestions.  Most contributions require you to agree to a
Contributor License Agreement (CLA) declaring that you have the right to, and actually do, grant us
the rights to use your contribution. For details, visit https://cla.microsoft.com.

When you submit a pull request, a CLA-bot will automatically determine whether you need to provide
a CLA and decorate the PR appropriately (e.g., label, comment). Simply follow the instructions
provided by the bot. You will only need to do this once across all repos using our CLA.

See [Code of Conduct](https://github.com/vscode-kubernetes-tools/vscode-kubernetes-tools/blob/HEAD/CODE_OF_CONDUCT.md) for the standards by which we ask community members
to abide.

For technical information about contributing, see [CONTRIBUTING.md](https://github.com/vscode-kubernetes-tools/vscode-kubernetes-tools/blob/HEAD/CONTRIBUTING.md).

# Acknowledgments

This extension was born from the `vs-kubernetes` extension by @brendandburns and
the `vs-helm` extension by @technosophos.

The 'infer `kubectl` version' feature was inspired by @jakepearson's `k` utility
(https://github.com/jakepearson/k), and some parts of the design were based on his implementation.
