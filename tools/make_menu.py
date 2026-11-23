"""Write the FancyMenu title-screen layout, with the pack version read from VERSION.

Output: config/fancymenu/customization/positronics_title.txt and config/fancymenu/customizablemenus.txt.
config/fancymenu/options.txt is tracked as-is (welcome screen and the top menu bar are off; Ctrl+Alt+C brings the bar back).
Assets (made once from branding/, not by this script): config/fancymenu/assets/positronics/menu_background.jpg, logo.png.
Keys follow FancyMenu 3.11.0 (1.20.1 branch): Layout.serialize, ElementBuilder, ImageElement, TextElementBuilder,
ButtonElementBuilder (legacy buttonaction/value), ImageMenuBackground.
Run: python -I tools/make_menu.py
"""
import os

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
FM = os.path.join(ROOT, "config", "fancymenu")
ASSETS = "[source:local]/config/fancymenu/assets/positronics"
ISSUES = "https://github.com/rafacost/positronics/issues/new/choose"

# Logo: 1024x369 source, drawn at 300x108 GUI px at the top of the left column.
LOGO_W, LOGO_H = 300, 108
COL_X = 40  # left edge of the logo, in GUI px from the screen's left side
BTN_X = COL_X + LOGO_W // 2 - 100  # 200-wide buttons centred under the logo


def block(name, props):
    lines = [f"{name} {{"]
    lines += [f"  {k} = {v}" for k, v in props.items()]
    lines.append("}")
    return "\n".join(lines)


def element(ident, etype, anchor, x, y, w, h, **extra):
    props = {
        "element_type": etype,
        "instance_identifier": ident,
        "anchor_point": anchor,
        "x": x, "y": y, "width": w, "height": h,
        "stretch_x": "false", "stretch_y": "false",
        "stay_on_screen": "true",
    }
    props.update(extra)
    return block("element", props)


def hidden(ident):
    return block("vanilla_button", {"element_type": "vanilla_button", "instance_identifier": ident, "is_hidden": "true"})


def moved(ident, x, y, w, h=20):
    # Any anchor other than "vanilla" makes FancyMenu use our position and size (VanillaWidgetElement).
    return block("vanilla_button", {"element_type": "vanilla_button", "instance_identifier": ident,
                                    "anchor_point": "mid-left", "x": x, "y": y, "width": w, "height": h,
                                    "stay_on_screen": "true"})


def main():
    version = open(os.path.join(ROOT, "VERSION"), encoding="utf-8").read().strip()
    parts = [
        "type = fancymenu_layout",
        block("layout-meta", {
            "identifier": "title_screen",
            "render_custom_elements_behind_vanilla": "false",
            "last_edited_time": "0",
            "is_enabled": "true",
            "widget_identifier_revision": "2",
            "randommode": "false",
            "randomgroup": "1",
            "randomonlyfirsttime": "false",
            "layout_index": "0",
        }),
        block("customization", {"action": "backgroundoptions", "keepaspectratio": "true"}),
        block("menu_background", {
            "instance_identifier": "positronics_menu_background",
            "background_type": "image",
            "show_background": "true",
            "image_path": f"{ASSETS}/menu_background.jpg",
            "slide": "false",
            "repeat_texture": "false",
            "parallax": "false",
        }),
        # Our logo replaces the vanilla one; the splash would sit on top of it.
        hidden("minecraft_logo_widget"),
        hidden("minecraft_splash_widget"),
        hidden("minecraft_realms_notification_icons_widget"),
        hidden("vanillabtn:mc_titlescreen_realms_button"),
        # Left column over the empty sky; the island fills the right half of the background.
        element("positronics_logo", "image", "mid-left", COL_X, -140, LOGO_W, LOGO_H,
                source=f"{ASSETS}/logo.png", repeat_texture="false", nine_slice_texture="false"),
        element("positronics_version", "text_v2", "mid-left", COL_X + 2, -29, 200, 14,
                source=f"**v{version}**",
                source_mode="direct", interactable="false", auto_line_wrapping="false", user_scrolling="false"),
        moved("vanillabtn:mc_titlescreen_singleplayer_button", BTN_X, -8, 200),
        moved("vanillabtn:mc_titlescreen_multiplayer_button", BTN_X, 16, 200),
        moved("vanillabtn:titlescreen_mods_button", BTN_X, 40, 200),
        moved("vanillabtn:mc_titlescreen_options_button", BTN_X, 64, 98),
        moved("vanillabtn:mc_titlescreen_quit_button", BTN_X + 102, 64, 98),
        moved("vanillabtn:mc_titlescreen_language_button", BTN_X - 24, 64, 20),
        moved("vanillabtn:mc_titlescreen_accessibility_button", BTN_X + 204, 64, 20),
        element("positronics_report_bug", "custom_button", "mid-left", BTN_X, 88, 200, 20,
                label="Report a Bug", buttonaction="openlink", value=ISSUES,
                description="Opens the GitHub issues page in your browser."),
    ]
    os.makedirs(os.path.join(FM, "customization"), exist_ok=True)
    with open(os.path.join(FM, "customization", "positronics_title.txt"), "w", encoding="utf-8", newline="\n") as f:
        f.write("\n\n".join(parts) + "\n")
    with open(os.path.join(FM, "customizablemenus.txt"), "w", encoding="utf-8", newline="\n") as f:
        f.write("type = customizablemenus\n\nnet.minecraft.client.gui.screens.TitleScreen {\n}\n")
    print(f"menu layout written for {version}")


if __name__ == "__main__":
    main()
