<script setup lang="ts">
import { computed, ref, watch, useTemplateRef } from "vue";
import { useFocus } from "@vueuse/core";

const props = defineProps({
    modelValue: {
        type: String,
        required: false,
        default: "",
    },
    startValue: {
        type: String,
        required: false,
    },
    color: {
        type: String,
        required: false,
        default: "neutral",
        validator: (value: string) =>
            ["primary", "neutral", "success", "warning", "danger"].includes(
                value,
            ),
    },
    variant: {
        type: String,
        required: false,
        default: "none",
        validator: (value: string) =>
            ["outlined", "soft", "ghost", "subtle", "none"].includes(value),
    },
    type: {
        type: String,
        required: false,
        default: "text",
        validator: (value: string) =>
            [
                "text",
                "password",
                "email",
                "number",
                "tel",
                "url",
                "search",
            ].includes(value),
    },
    placeholder: {
        type: String,
        required: false,
    },
    disabled: {
        type: Boolean,
        required: false,
        default: false,
    },
    readOnly: {
        type: Boolean,
        required: false,
        default: false,
    },
});

const inputValue = ref(props.modelValue || props.startValue);
const emit = defineEmits(["update:modelValue"]);

const inputRef = useTemplateRef("input");
const { focused: inputFocus } = useFocus(inputRef);

const inputClasses = computed(() => [
    "py-2",
    "px-3",
    "rounded-cu",
    "font-sans",
    "border-none",
    "placeholder:text-charcoal-400",
    "text-neutral-800",
    "focus:outline-none",
    "focus:ring-2",
    "w-full",
    {
        "cursor-not-allowed opacity-70": props.disabled,
    },
    {
        "focus:ring-primary-300": props.color === "primary",
        "focus:ring-charcoal-300": props.color === "neutral",
        "focus:ring-success-300": props.color === "success",
        "focus:ring-warning-300": props.color === "warning",
        "focus:ring-danger-300": props.color === "danger",
    },
    /* Regla general para subtle */
    {
        "bg-opacity-10 border-solid border-1": props.variant === "subtle",
    },
    /* Regla general para outlined */
    {
        "bg-transparent border-solid border-2": props.variant === "outlined",
    },
    /* Regla general para soft */
    {
        "bg-opacity-10 hover:bg-opacity-20": props.variant === "soft",
    },
    /* Regla general para ghost */
    {
        "bg-transparent hover:bg-opacity-10": props.variant === "ghost",
    },
    {
        "bg-primary border-primary-300":
            props.color === "primary" && props.variant === "subtle",
    },
    {
        "border-primary":
            props.color === "primary" && props.variant === "outlined",
    },
    {
        "bg-primary":
            props.color === "primary" && props.variant === "soft",
    },
    {
        "hover:bg-primary":
            props.color === "primary" && props.variant === "ghost",
    },
    {
        "bg-charcoal border-charcoal-300":
            props.color === "neutral" && props.variant === "subtle",
    },
    {
        "border-charcoal-800":
            props.color === "neutral" && props.variant === "outlined",
    },
    {
        "bg-charcoal":
            props.color === "neutral" && props.variant === "soft",
    },
    {
        "hover:bg-charcoal":
            props.color === "neutral" && props.variant === "ghost",
    },
    {
        "bg-success border-success-300":
            props.color === "success" && props.variant === "subtle",
    },
    {
        "border-success":
            props.color === "success" && props.variant === "outlined",
    },
    {
        "bg-success":
            props.color === "success" && props.variant === "soft",
    },
    {
        "hover:bg-success":
            props.color === "success" && props.variant === "ghost",
    },
    {
        "bg-warning border-warning-300":
            props.color === "warning" && props.variant === "subtle",
    },
    {
        "border-warning":
            props.color === "warning" && props.variant === "outlined",
    },
    {
        "bg-warning":
            props.color === "warning" && props.variant === "soft",
    },
    {
        "hover:bg-warning":
            props.color === "warning" && props.variant === "ghost",
    },
    {
        "bg-danger border-danger-300":
            props.color === "danger" && props.variant === "subtle",
    },
    {
        "border-danger":
            props.color === "danger" && props.variant === "outlined",
    },
    {
        "bg-danger":
            props.color === "danger" && props.variant === "soft",
    },
    {
        "hover:bg-danger":
            props.color === "danger" && props.variant === "ghost",
    },
    {
        "bg-transparent border-solid border-1 border-charcoal-100":
            props.variant === "none",
    },
]);

const get = () => {
    return inputValue.value;
};
const set = (value: string | number) => {
    inputValue.value = String(value);
};
const reset = () => {
    inputValue.value = "";
};

watch(
    () => props.modelValue,
    (val) => {
        inputValue.value = val;
    },
    { immediate: true },
);

defineExpose({
    get,
    set,
    reset,
    focus: () => inputFocus.value = true,
});
</script>

<template>
    <input
        ref="input"
        :type="props.type"
        :placeholder="props.placeholder"
        :value="inputValue"
        @input="
            (e) => {
                inputValue = (e.target as HTMLInputElement).value;
                emit('update:modelValue', inputValue);
            }
        "
        :class="inputClasses"
        :disabled="props.disabled"
        :readonly="props.readOnly"
        class="box-border"
    />
</template>

<style>
@unocss-placeholder;
</style>
