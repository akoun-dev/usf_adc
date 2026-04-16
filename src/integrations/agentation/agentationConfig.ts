import type { Annotation } from "agentation";

/**
 * Configuration pour les callbacks Agentation
 * Ces fonctions sont appelées lors des événements d'annotation
 */

export const handleAnnotationAdd = (annotation: Annotation) => {
	console.log("[Agentation] Annotation ajoutée:", annotation);

	// TODO: Envoyer vers votre API
	// sendToAPI('/api/annotations', annotation);
};

export const handleAnnotationUpdate = (annotation: Annotation) => {
	console.log("[Agentation] Annotation mise à jour:", annotation);

	// TODO: Mettre à jour via votre API
	// updateAPI('/api/annotations/' + annotation.id, annotation);
};

export const handleAnnotationDelete = (annotation: Annotation) => {
	console.log("[Agentation] Annotation supprimée:", annotation);

	// TODO: Supprimer via votre API
	// deleteAPI('/api/annotations/' + annotation.id);
};

export const handleAnnotationsClear = (annotations: Annotation[]) => {
	console.log("[Agentation] Toutes les annotations supprimées:", annotations);

	// TODO: Nettoyer via votre API
	// clearAPI('/api/annotations');
};

export const handleCopy = (markdown: string) => {
	console.log("[Agentation] Markdown copié:", markdown);
};

export const handleSubmit = (output: string, annotations: Annotation[]) => {
	console.log("[Agentation] Annotations soumises:");
	console.log("- Output:", output);
	console.log("- Annotations:", annotations);

	// TODO: Envoyer vers votre backend
	// sendToBackend({ output, annotations });
};

export const handleSessionCreated = (sessionId: string) => {
	console.log("[Agentation] Session créée:", sessionId);

	// Sauvegarder l'ID de session pour synchronisation
	if (typeof window !== "undefined") {
		window.localStorage.setItem("agentation_session_id", sessionId);
	}
};

/**
 * Configuration complète d'Agentation
 */
export const agentationConfig = {
	// Callbacks pour les événements d'annotation
	onAnnotationAdd: handleAnnotationAdd,
	onAnnotationUpdate: handleAnnotationUpdate,
	onAnnotationDelete: handleAnnotationDelete,
	onAnnotationsClear: handleAnnotationsClear,
	onCopy: handleCopy,
	onSubmit: handleSubmit,
	onSessionCreated: handleSessionCreated,

	// Configuration de la synchronisation
	endpoint: import.meta.env.VITE_AGENTATION_ENDPOINT || "http://localhost:4747",

	// Configuration du webhook (à remplacer par votre URL)
	webhookUrl: import.meta.env.VITE_AGENTATION_WEBHOOK_URL || "",

	// Copier dans le presse-papier (activé par défaut)
	copyToClipboard: true,
};

/**
 * Hook personnalisé pour gérer les annotations
 * Peut être utilisé dans les composants pour accéder aux annotations
 */
export const useAgentation = () => {
	return {
		config: agentationConfig,
		// Vous pouvez ajouter des méthodes utilitaires ici
		getSessionId: () => {
			if (typeof window !== "undefined") {
				return window.localStorage.getItem("agentation_session_id");
			}
			return null;
		},
		clearSessionId: () => {
			if (typeof window !== "undefined") {
				window.localStorage.removeItem("agentation_session_id");
			}
		},
	};
};
