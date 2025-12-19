export default class BaseKeyword {
    constructor(page) {
        this.page = page;
    }

    resolveActionTimeout(timeout) {
        // uses page context default actionTimeout if timeout not provided
        return timeout ?? this.page._actionTimeout ?? 30000;
    }

    resolveExpectTimeout(timeout) {
        return timeout ?? this.page._expectTimeout ?? 30000;
    }

    async handleFailure(error, failureHandling) {
        try {
            await this.page.screenshot({
                path: `screenshots/fail-${Date.now()}.png`,
            });
        } catch (e) {
            console.warn('Screenshot failed', e);
        }

        if (failureHandling === 'STOP_ON_FAILURE') {
            throw error;
        } else if (failureHandling === 'CONTINUE_ON_FAILURE') {
            console.error(`❌ ${error.message}`);
        } else if (failureHandling === 'OPTIONAL') {
            console.warn(`⚠️ ${error.message}`);
        }
    }
}
