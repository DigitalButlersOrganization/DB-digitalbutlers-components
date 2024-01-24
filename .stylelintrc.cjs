module.exports = {
	customSyntax: require("postcss-scss"),
	plugins: ["stylelint-scss", "stylelint-color-format", "stylelint-use-logical-spec"],
	extends: ["stylelint-config-recommended", "stylelint-config-idiomatic-order"],
	rules: {
		"at-rule-no-unknown": [
			true,
			{
				ignoreAtRules: ["mixin", "include"],
			},
		],
		"no-invalid-double-slash-comments": "never",
		"order/properties-alphabetical-order": null,
		"selector-class-pattern": null,
		indentation: "tab",
		"string-no-newline": true,
		"font-weight-notation": "numeric",
		"font-family-name-quotes": "always-unless-keyword",
		"keyframe-block-no-duplicate-selectors": true,
		"color-format/format": {
			format: "hsla",
		},
		"length-zero-no-unit": true,
		"number-max-precision": [
			2,
			{
				ignoreUnits: ["em", "rem"],
			},
		],
		"declaration-block-single-line-max-declarations": 1,
		"selector-attribute-quotes": "always",
		"function-url-quotes": "always",
		"string-quotes": "double",
		"declaration-block-no-shorthand-property-overrides": true,
		// next rule is optional, but I recommend turning it on
		"liberty/use-logical-spec": true,
	},
};
