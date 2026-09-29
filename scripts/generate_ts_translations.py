import os
import json
from translations_examiner import EXAMINER_PHRASES
from translations_blog_lexical import BLOG_LEXICAL_PHRASES
from translations_descriptors import DESCRIPTOR_PHRASES
from translations_trf_iq import TRF_IQ_PHRASES
from translations_director_creator import DIRECTOR_CREATOR_PHRASES
from translations_tests_nav import TESTS_NAV_PHRASES
from translations_trf_additional import TRF_ADDITIONAL_PHRASES
from translations_model_blog import MODEL_BLOG_PHRASES
from translations_creator_details import CREATOR_DETAILS_PHRASES
from translations_iq_youtube_media import IQ_YOUTUBE_MEDIA_PHRASES
from translations_labels_director_office import LABELS_DIRECTOR_OFFICE_PHRASES
from translations_academic_vocabulary import ACADEMIC_VOCABULARY

os.makedirs("src/utils/translations", exist_ok=True)

modules = [
    ("uiExaminerPhrases.ts", "UI_EXAMINER_PHRASES", EXAMINER_PHRASES),
    ("uiBlogLexicalPhrases.ts", "UI_BLOG_LEXICAL_PHRASES", BLOG_LEXICAL_PHRASES),
    ("uiDescriptorsPhrases.ts", "UI_DESCRIPTORS_PHRASES", DESCRIPTOR_PHRASES),
    ("uiTrfIqPhrases.ts", "UI_TRF_IQ_PHRASES", TRF_IQ_PHRASES),
    ("uiDirectorCreatorPhrases.ts", "UI_DIRECTOR_CREATOR_PHRASES", DIRECTOR_CREATOR_PHRASES),
    ("uiTestsNavPhrases.ts", "UI_TESTS_NAV_PHRASES", TESTS_NAV_PHRASES),
    ("uiTrfAdditionalPhrases.ts", "UI_TRF_ADDITIONAL_PHRASES", TRF_ADDITIONAL_PHRASES),
    ("uiModelBlogPhrases.ts", "UI_MODEL_BLOG_PHRASES", MODEL_BLOG_PHRASES),
    ("uiCreatorDetailsPhrases.ts", "UI_CREATOR_DETAILS_PHRASES", CREATOR_DETAILS_PHRASES),
    ("uiIqYoutubeMediaPhrases.ts", "UI_IQ_YOUTUBE_MEDIA_PHRASES", IQ_YOUTUBE_MEDIA_PHRASES),
    ("uiLabelsDirectorOfficePhrases.ts", "UI_LABELS_DIRECTOR_OFFICE_PHRASES", LABELS_DIRECTOR_OFFICE_PHRASES),
    ("uiAcademicVocabulary.ts", "UI_ACADEMIC_VOCABULARY", ACADEMIC_VOCABULARY),
]

for filename, var_name, data in modules:
    target_path = os.path.join("src/utils/translations", filename)
    # Normalize keys to lower-case and strip
    normalized_data = {}
    for k, v in data.items():
        normalized_data[k.lower().strip()] = v
        # Also store original casing if different
        if k.strip() != k.lower().strip():
            normalized_data[k.strip()] = v

    ts_content = 'import { SupportedLanguage } from "../../types/language";\n\n'
    ts_content += f'export const {var_name}: Record<string, Partial<Record<SupportedLanguage, string>>> = '
    ts_content += json.dumps(normalized_data, ensure_ascii=False, indent=2)
    ts_content += ';\n'

    with open(target_path, "w", encoding="utf-8") as f:
        f.write(ts_content)
    print(f"Generated {target_path} with {len(normalized_data)} phrases")

# Generate allUiTranslations.ts
agg_path = "src/utils/translations/allUiTranslations.ts"
agg_content = 'import { SupportedLanguage } from "../../types/language";\n'
for filename, var_name, _ in modules:
    mod_name = filename.replace(".ts", "")
    agg_content += f'import {{ {var_name} }} from "./{mod_name}";\n'

agg_content += '\nexport const ALL_NEW_UI_TRANSLATIONS: Record<string, Partial<Record<SupportedLanguage, string>>> = {\n'
for _, var_name, _ in modules:
    agg_content += f'  ...{var_name},\n'
agg_content += '};\n'

with open(agg_path, "w", encoding="utf-8") as f:
    f.write(agg_content)
print(f"Generated {agg_path}")
