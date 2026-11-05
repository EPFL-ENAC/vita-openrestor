<template>
    <section
        class="model-card-form"
        :class="{ 'model-card-form--compact': compact, 'model-card-form--locked': locked }"
    >
        <div class="model-card-form__heading">
            <h2 class="model-card-form__title">{{ t('submission.modelCard.title') }}</h2>
            <locked-badge v-if="locked && compact" />
        </div>

        <div class="model-card-form__fields">
            <label v-for="field in visibleFields" :key="field" class="model-card-form__field">
                <span class="model-card-form__label">
                    {{ t(`submission.modelCard.fields.${field}.label`) }}
                </span>

                <span v-if="locked" class="model-card-form__value">
                    {{ modelValue[field] || t('submission.modelCard.empty') }}
                </span>
                <span v-else-if="field === 'licence'" class="model-card-form__select">
                    <select
                        :value="modelValue.licence"
                        class="model-card-form__input"
                        :class="{ 'model-card-form__input--empty': !modelValue.licence }"
                        @change="update('licence', ($event.target as HTMLSelectElement).value)"
                    >
                        <option value="" disabled>
                            {{ t('submission.modelCard.fields.licence.placeholder') }}
                        </option>
                        <option v-for="licence in LICENCES" :key="licence" :value="licence">
                            {{ licence }}
                        </option>
                    </select>
                    <img :src="expandIcon" width="8" height="4" alt="" />
                </span>
                <input
                    v-else
                    :value="modelValue[field]"
                    type="text"
                    class="model-card-form__input"
                    :placeholder="t(`submission.modelCard.fields.${field}.placeholder`)"
                    @input="update(field, ($event.target as HTMLInputElement).value)"
                />
            </label>
        </div>

        <button
            v-if="compact"
            type="button"
            class="model-card-form__more"
            :aria-expanded="expanded"
            @click="expanded = !expanded"
        >
            {{
                expanded
                    ? t('submission.modelCard.fewerFields')
                    : t('submission.modelCard.moreFields', {
                          n: FIELDS.length - COMPACT_FIELDS.length,
                      })
            }}
        </button>

        <i18n-t
            :keypath="
                locked ? 'submission.modelCard.termsAccepted' : 'submission.modelCard.termsAgree'
            "
            tag="p"
            class="model-card-form__terms"
            scope="global"
        >
            <template #terms>
                <a :href="TERMS_URL" target="_blank" rel="noopener">{{
                    t('submission.modelCard.terms')
                }}</a>
            </template>
        </i18n-t>
    </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import LockedBadge from 'components/LockedBadge.vue';
import expandIcon from 'assets/icons/expand-8.svg';
import type { ModelCardFields } from 'src/types/submissions';

// The model card sent with a submission (organism/Submission/Model card): editable in a
// draft, locked once checks start. Mobile shows three fields and folds the rest.
const props = defineProps<{
    modelValue: ModelCardFields;
    locked?: boolean;
    compact?: boolean;
}>();

const emit = defineEmits<{ 'update:modelValue': [value: ModelCardFields] }>();

const { t } = useI18n();

const TERMS_URL = 'https://openrestor.org/terms';

// [Licence list: to confirm with VITA]
const LICENCES = ['MIT', 'Apache-2.0', 'BSD-3-Clause', 'GPL-3.0', 'CC-BY-4.0', 'CC-BY-NC-4.0'];

const FIELDS: (keyof ModelCardFields)[] = [
    'name',
    'authors',
    'architecture',
    'parameters',
    'trainingData',
    'codeRepo',
    'dataRepo',
    'paper',
    'licence',
];
const COMPACT_FIELDS: (keyof ModelCardFields)[] = ['name', 'parameters', 'licence'];

const expanded = ref(false);

const visibleFields = computed(() => (props.compact && !expanded.value ? COMPACT_FIELDS : FIELDS));

function update(field: keyof ModelCardFields, value: string) {
    emit('update:modelValue', { ...props.modelValue, [field]: value });
}
</script>

<style scoped lang="scss">
.model-card-form {
    display: flex;
    flex-direction: column;
    gap: 14px;
    padding: 20px;
    border-radius: var(--or-radius-lg);
    background: var(--or-bg-raised);

    &__heading {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 8px;
    }

    &__title {
        margin: 0;
        font-family: inherit;
        font-size: 18px;
        font-weight: 800;
        line-height: 1.25;
    }

    &__fields {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: 14px;
    }

    &__field {
        display: flex;
        flex-direction: column;
        gap: 6px;
        min-width: 0;
    }

    &__label {
        font-size: 14px;
        font-weight: 700;
    }

    &__input,
    &__value {
        display: flex;
        align-items: center;
        width: 100%;
        height: 44px;
        padding: 0 13px;
        border: 0;
        border-radius: var(--or-radius-sm);
        outline: 0;
        background: var(--or-bg-control);
        color: var(--or-text);
        font: inherit;
        font-size: 14px;
    }

    &__input {
        &::placeholder,
        &--empty {
            color: var(--or-text-placeholder);
        }

        &:focus-visible {
            box-shadow: inset 0 0 0 1px var(--or-border-strong);
        }
    }

    &__value {
        display: block;
        padding: 0 12px;
        overflow: hidden;
        background: var(--or-bg-surface);
        color: var(--or-text-muted);
        line-height: 44px;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    &__select {
        position: relative;
        display: flex;

        select {
            padding-right: 32px;
            appearance: none;
            cursor: pointer;
        }

        img {
            position: absolute;
            top: 50%;
            right: 13px;
            transform: translateY(-50%);
            pointer-events: none;
        }
    }

    &__more {
        align-self: flex-start;
        padding: 0;
        border: 0;
        background: none;
        color: var(--or-text);
        font: inherit;
        font-size: 14px;
        font-weight: 800;
        text-decoration: underline;
        cursor: pointer;
    }

    &__terms {
        margin: 0;
        padding-top: 16px;
        border-top: 1px solid var(--or-border-subtle);
        color: var(--or-text-muted);
        font-size: 13px;
        line-height: 1.4;

        a {
            color: var(--or-text);
            font-weight: 500;
        }
    }

    &--locked {
        gap: 20px;

        .model-card-form__fields {
            gap: 16px;
        }

        .model-card-form__field {
            gap: 8px;
        }
    }

    &--compact {
        gap: 10px;
        padding: 16px;

        .model-card-form__title {
            font-size: 14px;
        }

        .model-card-form__fields {
            grid-template-columns: minmax(0, 1fr);
            gap: 12px;
        }

        .model-card-form__more {
            margin-top: 11px;
        }

        .model-card-form__terms {
            padding-top: 12px;
        }

        &.model-card-form--locked {
            gap: 18px;

            .model-card-form__fields {
                gap: 18px;
            }

            .model-card-form__more {
                margin-top: 0;
                font-size: 13px;
                font-weight: 700;
                text-decoration: none;
            }
        }
    }
}
</style>
