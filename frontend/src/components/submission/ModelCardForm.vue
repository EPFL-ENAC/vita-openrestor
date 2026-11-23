<template>
    <section
        class="model-card-form column no-wrap bg-raised"
        :class="{ 'model-card-form--compact': compact, 'model-card-form--locked': locked }"
    >
        <div class="model-card-form__heading row no-wrap items-center justify-between">
            <h2
                class="q-my-none"
                :class="compact ? 'text-subtitle2 text-weight-bolder' : 'text-h5'"
            >
                {{ t('submission.modelCard.title') }}
            </h2>
            <locked-badge v-if="locked && compact" />
        </div>

        <div class="model-card-form__fields">
            <label
                v-for="field in visibleFields"
                :key="field"
                class="model-card-form__field column no-wrap"
            >
                <span class="text-subtitle2">
                    {{ t(`submission.modelCard.fields.${field}.label`) }}
                </span>

                <span
                    v-if="locked"
                    class="model-card-form__value ellipsis text-body1 text-muted bg-surface"
                >
                    {{ modelValue[field] || t('submission.modelCard.empty') }}
                </span>
                <span
                    v-else-if="field === 'licence'"
                    class="model-card-form__select row no-wrap relative-position"
                >
                    <select
                        :value="modelValue.licence"
                        class="model-card-form__input text-body1 bg-control cursor-pointer"
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
                    <img
                        :src="expandIcon"
                        width="8"
                        height="4"
                        alt=""
                        class="model-card-form__chevron no-pointer-events"
                    />
                </span>
                <input
                    v-else
                    :value="modelValue[field]"
                    type="text"
                    class="model-card-form__input text-body1 bg-control"
                    :placeholder="t(`submission.modelCard.fields.${field}.placeholder`)"
                    @input="update(field, ($event.target as HTMLInputElement).value)"
                />
            </label>
        </div>

        <button
            v-if="compact"
            type="button"
            class="model-card-form__more plain-button self-start"
            :class="
                locked
                    ? 'text-body2 text-weight-bold'
                    : 'q-mt-sm-md text-subtitle2 text-weight-bolder'
            "
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
            class="model-card-form__terms q-my-none text-body2 text-muted"
            scope="global"
        >
            <template #terms>
                <a
                    :href="TERMS_URL"
                    target="_blank"
                    rel="noopener"
                    class="model-card-form__terms-link"
                    >{{ t('submission.modelCard.terms') }}</a
                >
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
// Typography, colors and flex come from the global classes in the template (Quasar's
// normalize already makes inputs and selects inherit the font). Only the card's gaps,
// the field grid, the input box and its states stay here.
.model-card-form {
    gap: var(--or-spacing-sm-md);
    padding: var(--or-spacing-md-lg);
    border-radius: var(--or-radius-lg);

    &__heading {
        gap: var(--or-spacing-sm);
    }

    &__fields {
        display: grid;
        grid-template-columns: repeat(2, minmax(0, 1fr));
        gap: var(--or-spacing-sm-md);
    }

    &__field {
        gap: var(--or-spacing-xs);
        min-width: 0;
    }

    &__input,
    &__value {
        width: 100%;
        height: 44px;
        padding: 0 var(--or-spacing-sm-md);
        border-radius: var(--or-radius-sm);
    }

    &__input {
        border: 0;
        outline: 0;
        color: var(--or-text);

        &::placeholder,
        &--empty {
            color: var(--or-text-placeholder);
        }

        &:focus-visible {
            box-shadow: inset 0 0 0 1px var(--or-border-strong);
        }
    }

    // Read-only value: one line, centred in the same 44px height as the inputs
    &__value {
        line-height: 44px;
    }

    &__select .model-card-form__input {
        padding-right: var(--or-spacing-xl);
        appearance: none;
    }

    &__chevron {
        position: absolute;
        top: 50%;
        right: 13px;
        transform: translateY(-50%);
    }

    &__more {
        color: var(--or-text);
        text-decoration: underline;
    }

    &__terms {
        padding-top: var(--or-spacing-md);
        border-top: 1px solid var(--or-border-subtle);
    }

    &__terms-link {
        color: var(--or-text);
    }

    &--locked {
        gap: var(--or-spacing-md-lg);

        .model-card-form__fields {
            gap: var(--or-spacing-md);
        }

        .model-card-form__field {
            gap: var(--or-spacing-sm);
        }

        .model-card-form__more {
            text-decoration: none;
        }
    }

    &--compact {
        gap: var(--or-spacing-sm);
        padding: var(--or-spacing-md);

        .model-card-form__fields {
            grid-template-columns: minmax(0, 1fr);
        }

        .model-card-form__terms {
            padding-top: var(--or-spacing-sm-md);
        }

        &.model-card-form--locked {
            gap: var(--or-spacing-md);
        }
    }
}
</style>
