import ''

declare global {
  /** 将网页保存为单文件方法 https://github.com/gildas-lormeau/SingleFile */
  const singlefile: {
    /** 此方法描述参数 https://github.com/gildas-lormeau/SingleFile/wiki/How-to-integrate-SingleFile-library-code-in-%22custom%22-environments%3F */
    init: (e?: typeof fetch) => void

    /** 此方法参数参考 https://github.com/gildas-lormeau/SingleFile/blob/master/src/core/bg/config.js */
    getPageData: (
      config: Partial<{
        removeHiddenElements: boolean
        removeUnusedStyles: boolean
        removeUnusedFonts: boolean
        removeFrames: boolean
        removeImports: boolean
        compressHTML: boolean
        compressCSS: boolean
        loadDeferredImages: boolean
        loadDeferredImagesMaxIdleTime: number
        loadDeferredImagesBlockCookies: boolean
        loadDeferredImagesBlockStorage: boolean
        loadDeferredImagesKeepZoomLevel: boolean
        loadDeferredImagesDispatchScrollEvent: boolean
        loadDeferredImagesBeforeFrames: boolean
        filenameTemplate: string
        infobarTemplate: string
        includeInfobar: boolean
        confirmInfobarContent: boolean
        autoClose: boolean
        confirmFilename: boolean
        filenameConflictAction: string
        filenameMaxLength: number
        filenameMaxLengthUnit: string
        filenameReplacedCharacters: string[]
        filenameReplacementCharacter: string
        replaceEmojisInFilename: boolean
        saveFilenameTemplateData: boolean
        contextMenuEnabled: boolean
        tabMenuEnabled: boolean
        browserActionMenuEnabled: boolean
        shadowEnabled: boolean
        logsEnabled: boolean
        progressBarEnabled: boolean
        maxResourceSizeEnabled: boolean
        maxResourceSize: number
        displayInfobar: boolean
        displayStats: boolean
        backgroundSave: RegExp
        defaultEditorMode: string
        applySystemTheme: boolean
        autoSaveDelay: string
        autoSaveLoad: boolean
        autoSaveUnload: boolean
        autoSaveLoadOrUnload: boolean
        autoSaveDiscard: boolean
        autoSaveRemove: boolean
        autoSaveRepeat: boolean
        autoSaveRepeatDelay: string
        removeAlternativeFonts: boolean
        removeAlternativeMedias: boolean
        removeAlternativeImages: boolean
        groupDuplicateImages: boolean
        maxSizeDuplicateImages: number
        saveRawPage: boolean
        saveToClipboard: boolean
        addProof: boolean
        saveToGDrive: boolean
        saveToDropbox: boolean
        saveWithWebDAV: boolean
        webDAVURL: string
        webDAVUser: string
        webDAVPassword: string
        saveToGitHub: boolean
        githubToken: string
        githubUser: string
        githubRepository: string
        githubBranch: string
        saveWithCompanion: boolean
        sharePage: boolean
        forceWebAuthFlow: boolean
        resolveFragmentIdentifierURLs: boolean
        userScriptEnabled: boolean
        openEditor: boolean
        openSavedPage: boolean
        autoOpenEditor: boolean
        saveCreatedBookmarks: boolean
        allowedBookmarkFolders: any[]
        ignoredBookmarkFolders: any[]
        replaceBookmarkURL: boolean
        saveFavicon: boolean
        includeBOM: boolean
        warnUnsavedPage: boolean
        displayInfobarInEditor: boolean
        compressContent: boolean
        createRootDirectory: boolean
        selfExtractingArchive: boolean
        extractDataFromPage: boolean
        preventAppendedData: boolean
        insertEmbeddedImage: boolean
        insertTextBody: boolean
        autoSaveExternalSave: boolean
        insertMetaNoIndex: boolean
        insertMetaCSP: boolean
        passReferrerOnError: boolean
        password: ''
        insertSingleFileComment: boolean
        removeSavedDate: boolean
        blockMixedContent: boolean
        saveOriginalURLs: boolean
        acceptHeaders: {
          font: string
          image: string
          stylesheet: string
          script: string
          document: string
          video: string
          audio: string
        }
        moveStylesInHead: boolean
        networkTimeout: number
        woleetKey: string
        blockImages: boolean
        blockStylesheets: boolean
        blockFonts: boolean
        blockScripts: boolean
        blockVideos: boolean
        blockAudios: boolean
        delayBeforeProcessing: number
        _migratedTemplateFormat: boolean
      }>
    ) => {
      content: string
      filename: string
      mimeType: string
      stats: string
      title: string
    }
  }
}
