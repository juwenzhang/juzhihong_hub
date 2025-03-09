/**
 * MIT License
 *
 * Copyright (c) 2025 ZhiHong Ju
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */

// user part
const UserErrorMessages = {
    NAME_OR_PASSWORD_IS_REQUIRED: "name_or_password_is_required",
    USER_ALREADY_EXISTS: "user_already_exists",
    PASSWORD_LENGTH_IS_TOO_SHORT: "password_length_is_too_short",
    PASSWORD_IS_NOT_STRONG: "password_is_not_strong",
    USER_INFO_NOT_EXIST: "user_info_not_exist",
    USER_PASSWORD_IS_INCORRECT: "user_password_is_incorrect",
    TOKEN_GENERATE_FAILED: "token_generate_failed",
    TOKEN_IS_REQUIRED: "token_is_required",
    TOKEN_VERIFY_FAILED: "token_verify_failed",
    TOKEN_VERIFY_EXPIRED: "token_verify_expired",
    REDIS_CONNECTION_FAILED: "redis_connection_failed",
    TOKEN_FORMAT_IS_INCORRECT: "token_format_is_incorrect",
    CREATE_USER_TABLE_ERROR: "create_user_table_error"
}

// moment part
const MomentErrorMessages = {
    MOMENT_USER_NOT_EXIST: "moment_user_not_exist",
    MOMENT_NOT_EXIST: "moment_not_exist",
    MOMENT_CONTENT_IS_REQUIRED: "moment_content_is_required",
    MOMENT_USER_NOT_PERMISSION: "moment_user_not_permission",
    CREATE_MOMENT_TABLE_ERROR: "create_moment_table_error"
}

// comment part
const CommentErrorMessage = {
    CREATE_COMMENT_TABLE_ERROR: "create_comment_table_error",
    COMMENT_CREATE_ERROR: "comment_create_error"
}

// label part
const LabelErrorMessage = {
    CREATE_LABEL_TABLE_ERROR: "create_label_table_error",
    LABEL_IS_EXIST: "label_is_exist",
    LABEL_NAMES_IS_REQUIRED: "label_names_is_required",
    LABEL_NAMES_IS_NOT_ARRAY: "label_names_is_not_array"
}

module.exports = {
    UserErrorMessages,
    MomentErrorMessages,
    CommentErrorMessage,
    LabelErrorMessage
}