const toasty = (options) => {
	const { text, type = "info" } = options;
	Toastify({
		/* eslint-disable-line new-cap */ text,
		className: `toast-${type}`,
	}).showToast();
};

export { toasty };
