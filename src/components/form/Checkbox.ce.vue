<script setup lang="ts">
import { computed, ref, watch } from "vue";

const props = defineProps({
    modelValue: {
        type: Boolean,
        required: false,
        default: false,
    },
    checked: {
        type: Boolean,
        required: false,
        default: false,
    },
    color: {
        type: String,
        required: false,
        default: "primary",
        validator: (value: string) =>
            ["primary", "neutral", "success", "warning", "danger"].includes(
                value,
            ),
    },
    variant: {
        type: String,
        required: false,
        default: "outlined",
        validator: (value: string) =>
            ["outlined", "soft", "ghost", "subtle", "none"].includes(value),
    },
    disabled: {
        type: Boolean,
        required: false,
        default: false,
    },
    label: {
        type: String,
        required: false,
    },
});

const emit = defineEmits(["update:modelValue", "change"]);
const checked = ref(props.modelValue || props.checked);

const checkboxClasses = computed(() => ({
    "cursor-not-allowed opacity-70": props.disabled,
}));
const boxClasses = computed(() => [
    {
        "bg-transparent border-solid border-2": props.variant === "outlined",
    },
    /* Regla general para subtle */
    {
        "border-2 border-solid border-1": props.variant === "subtle",
    },
    /* Regla general para ghost */
    {
        "border-2 border-solid border-transparent": props.variant === "ghost",
    },
    /* Regla general para soft */
    {
        "border-2 border-solid": props.variant === "soft",
    },
    /* Reglas para outlined (por color) */
    /* Outlined - unchecked */
    {
        "border-primary": props.color === "primary" && props.variant === "outlined" && !checked.value,
    },
    {
        "border-charcoal-800": props.color === "neutral" && props.variant === "outlined" && !checked.value,
    },
    {
        "border-success": props.color === "success" && props.variant === "outlined" && !checked.value,
    },
    {
        "border-warning": props.color === "warning" && props.variant === "outlined" && !checked.value,
    },
    {
        "border-danger": props.color === "danger" && props.variant === "outlined" && !checked.value,
    },
    /* Outlined - checked */
    {
        "bg-primary-500 border-primary": props.color === "primary" && props.variant === "outlined" && checked.value,
    },
    {
        "bg-charcoal-500 border-charcoal-800": props.color === "neutral" && props.variant === "outlined" && checked.value,
    },
    {
        "bg-success-500 border-success": props.color === "success" && props.variant === "outlined" && checked.value,
    },
    {
        "bg-warning-500 border-warning": props.color === "warning" && props.variant === "outlined" && checked.value,
    },
    {
        "bg-danger-500 border-danger": props.color === "danger" && props.variant === "outlined" && checked.value,
    },
    /* Regla para none */
    {
        "bg-transparent border-solid border-1 border-charcoal-100": props.variant === "none",
    },

    {
        "border-2 border-solid border-primary-500 bg-primary bg-opacity-10":
            props.color === "primary" &&
            props.variant === "soft" &&
            !checked.value,
    },
    {
        "border-2 border-solid border-primary-500 bg-primary-500":
            props.color === "primary" &&
            props.variant === "soft" &&
            checked.value,
    },
    {
        "border-2 border-solid border-1 border-primary-300 bg-primary bg-opacity-10":
            props.color === "primary" &&
            props.variant === "subtle" &&
            !checked.value,
    },
    {
        "border-2 border-solid border-1 border-primary-300 bg-primary-500":
            props.color === "primary" &&
            props.variant === "subtle" &&
            checked.value,
    },
    {
        "border-2 border-solid border-transparent bg-transparent hover:bg-primary hover:bg-opacity-10":
            props.color === "primary" &&
            props.variant === "ghost" &&
            !checked.value,
    },
    {
        "border-2 border-solid border-transparent bg-primary-500":
            props.color === "primary" &&
            props.variant === "ghost" &&
            checked.value,
    },

    {
        "border-2 border-solid border-charcoal-500 bg-charcoal bg-opacity-10":
            props.color === "neutral" &&
            props.variant === "soft" &&
            !checked.value,
    },
    {
        "border-2 border-solid border-charcoal-500 bg-charcoal-500":
            props.color === "neutral" &&
            props.variant === "soft" &&
            checked.value,
    },
    {
        "border-2 border-solid border-1 border-charcoal-300 bg-charcoal bg-opacity-10":
            props.color === "neutral" &&
            props.variant === "subtle" &&
            !checked.value,
    },
    {
        "border-2 border-solid border-1 border-charcoal-300 bg-charcoal-500":
            props.color === "neutral" &&
            props.variant === "subtle" &&
            checked.value,
    },
    {
        "border-2 border-solid border-transparent hover:bg-charcoal hover:bg-opacity-10":
            props.color === "neutral" &&
            props.variant === "ghost" &&
            !checked.value,
    },
    {
        "border-2 border-solid border-transparent bg-charcoal-500":
            props.color === "neutral" &&
            props.variant === "ghost" &&
            checked.value,
    },

    {
        "border-2 border-solid border-success-500 bg-success bg-opacity-10":
            props.color === "success" &&
            props.variant === "soft" &&
            !checked.value,
    },
    {
        "border-2 border-solid border-success-500 bg-success-500":
            props.color === "success" &&
            props.variant === "soft" &&
            checked.value,
    },
    {
        "border-2 border-solid border-1 border-success-300 bg-success bg-opacity-10":
            props.color === "success" &&
            props.variant === "subtle" &&
            !checked.value,
    },
    {
        "border-2 border-solid border-1 border-success-300 bg-success-500":
            props.color === "success" &&
            props.variant === "subtle" &&
            checked.value,
    },
    {
        "border-2 border-solid border-transparent hover:bg-success hover:bg-opacity-10":
            props.color === "success" &&
            props.variant === "ghost" &&
            !checked.value,
    },
    {
        "border-2 border-solid border-transparent bg-success-500":
            props.color === "success" &&
            props.variant === "ghost" &&
            checked.value,
    },

    {
        "border-2 border-solid border-warning-500 bg-warning bg-opacity-10":
            props.color === "warning" &&
            props.variant === "soft" &&
            !checked.value,
    },
    {
        "border-2 border-solid border-warning-500 bg-warning-500":
            props.color === "warning" &&
            props.variant === "soft" &&
            checked.value,
    },
    {
        "border-2 border-solid border-1 border-warning-300 bg-warning bg-opacity-10":
            props.color === "warning" &&
            props.variant === "subtle" &&
            !checked.value,
    },
    {
        "border-2 border-solid border-1 border-warning-300 bg-warning-500":
            props.color === "warning" &&
            props.variant === "subtle" &&
            checked.value,
    },
    {
        "border-2 border-solid border-transparent bg-transparent hover:bg-warning hover:bg-opacity-10":
            props.color === "warning" &&
            props.variant === "ghost" &&
            !checked.value,
    },
    {
        "border-2 border-solid border-transparent bg-warning-500":
            props.color === "warning" &&
            props.variant === "ghost" &&
            checked.value,
    },

    {
        "border-2 border-solid border-danger-500 bg-danger bg-opacity-10":
            props.color === "danger" &&
            props.variant === "soft" &&
            !checked.value,
    },
    {
        "border-2 border-solid border-danger-500 bg-danger-500":
            props.color === "danger" &&
            props.variant === "soft" &&
            checked.value,
    },
    {
        "border-2 border-solid border-1 border-danger-300 bg-danger bg-opacity-10":
            props.color === "danger" &&
            props.variant === "subtle" &&
            !checked.value,
    },
    {
        "border-2 border-solid border-1 border-danger-300 bg-danger-500":
            props.color === "danger" &&
            props.variant === "subtle" &&
            checked.value,
    },
    {
        "border-2 border-solid border-transparent bg-transparent hover:bg-danger hover:bg-opacity-10":
            props.color === "danger" &&
            props.variant === "ghost" &&
            !checked.value,
    },
    {
        "border-2 border-solid border-transparent bg-danger-500":
            props.color === "danger" &&
            props.variant === "ghost" &&
            checked.value,
    },
]);

const handleClick = () => {
    if (props.disabled) return;
    checked.value = !checked.value;
    emit("update:modelValue", checked.value);
    emit("change", { target: { checked: checked.value } });
};

watch(
    () => props.modelValue,
    (val) => {
        checked.value = val;
    },
);

watch(
    () => props.checked,
    (val) => {
        checked.value = val;
    },
);

defineExpose({
    get: () => checked.value,
    set: (value: boolean) => {
        checked.value = value;
        emit("update:modelValue", value);
        emit("change", { target: { checked: value } });
    },
    reset: () => {
        checked.value = false;
        emit("update:modelValue", false);
        emit("change", { target: { checked: false } });
    },
});
</script>

<template>
    <label
        class="flex items-center gap-2 cursor-pointer"
        :class="checkboxClasses"
    >
        <input
            type="checkbox"
            :checked="checked"
            @change="
                (e) => {
                    checked = (e.target as HTMLInputElement).checked;
                    emit('update:modelValue', checked);
                    emit('change', e);
                }
            "
            :disabled="props.disabled"
            class="absolute opacity-0 w-0 h-0"
        />
        <div
            class="relative w-3.5 h-3.5 rounded-cu flex items-center justify-center transition-all duration-200"
            :class="boxClasses"
        >
            <svg
                v-if="checked"
                xmlns="http://www.w3.org/2000/svg"
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="3"
                stroke-linecap="round"
                stroke-linejoin="round"
                class="text-white"
            >
                <path d="M20 6L9 17l-5-5" />
            </svg>
        </div>
        <span v-if="props.label" class="text-sm text-charcoal-800">{{
            props.label
        }}</span>
    </label>
</template>

<style>
@unocss-placeholder;
</style>
