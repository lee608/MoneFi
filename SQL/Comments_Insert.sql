USE [MoneFi]
GO
/****** Object:  StoredProcedure [dbo].[Comments_Insert]    Script Date: 6/15/2023 11:47:47 PM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author: Byungsu Lee
-- Create date: 05/06/2023
-- Description: Insert Comments
-- Code Reviewer: Alejandro Espinosa

-- MODIFIED BY:
-- MODIFIED DATE:
-- Code Reviewer:
-- Note:
-- =============================================



ALTER PROC [dbo].[Comments_Insert]
			@Subject nvarchar(50) = null
		   ,@Text nvarchar(3000)
		   ,@ParentId int = null
		   ,@EntityTypeId int
		   ,@EntityId int 
		   ,@CreatedBy int 
		   ,@Id int OUTPUT

/*

select *
from dbo.Comments 

	Declare @Id int = 0
			,@Subject nvarchar(50) = 'test_subject04'
			,@Text nvarchar(3000) = 'test_text03'
			,@ParentId int = 19
			,@EntityTypeId int = 6
			,@EntityId int = 15
			,@CreatedBy int = 9
	
	Execute dbo.Comments_Insert
		
		    @Subject
			,@Text
			,@ParentId
			,@EntityTypeId
			,@EntityId
			,@CreatedBy
			,@Id
	
select *
from dbo.Comments

*/


AS

BEGIN

	INSERT INTO dbo.Comments
				([Subject]
				,[Text]
				,[ParentId]
				,[EntityTypeId]
				,[EntityId]
				,[CreatedBy])
	VALUES		(@Subject
				,@Text
				,@ParentId
				,@EntityTypeId
				,@EntityId
				,@CreatedBy)

	SET @Id = Scope_Identity()

END